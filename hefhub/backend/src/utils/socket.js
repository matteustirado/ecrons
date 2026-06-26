const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const { getCrowdState } = require('../services/crowdState');

const prisma = new PrismaClient();

let io;

const normalizeUnitRoom = (room) => {
  if (!room || typeof room !== 'string') {
    return null;
  }

  if (!room.startsWith('unidade_')) {
    return null;
  }

  const unidade = room
    .replace('unidade_', '')
    .trim()
    .toUpperCase();

  if (!['SP', 'BH', 'RJ'].includes(unidade)) {
    return null;
  }

  return {
    unidade,
    room: `unidade_${unidade}`,
  };
};

exports.initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        socket.isPublicDisplay = true;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id || decoded.userId,
        },
      });

      if (!user || !user.isActive) {
        socket.isPublicDisplay = true;
        return next();
      }

      socket.user = user;
      socket.isPublicDisplay = false;

      return next();
    } catch (error) {
      socket.isPublicDisplay = true;
      return next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Cliente conectado: ${socket.id}`);

    socket.join('public_prices');

    if (socket.user?.role) {
      socket.join(`role_${socket.user.role}`);
    }

    socket.on('join_room', (requestedRoom) => {
      if (!requestedRoom || typeof requestedRoom !== 'string') {
        console.warn(
          `[Socket] Cliente ${socket.id} tentou entrar em uma sala inválida.`
        );
        return;
      }

      const unitRoom = normalizeUnitRoom(requestedRoom);

      /*
       * Para salas de unidades, normalizamos o nome:
       * unidade_sp -> unidade_SP
       * unidade_rj -> unidade_RJ
       */
      const roomToJoin = unitRoom?.room || requestedRoom;

      socket.join(roomToJoin);

      console.log(
        `[Socket] Cliente ${socket.id} entrou na sala: ${roomToJoin}`
      );

      /*
       * Quando o painel entra em uma sala de unidade,
       * recebe imediatamente a última lotação já conhecida.
       *
       * Isso impede que o termômetro fique em 0%
       * até o próximo ciclo de 60 segundos do daemon.
       */
      if (unitRoom) {
        const currentCrowd = getCrowdState(unitRoom.unidade);

        if (currentCrowd) {
          console.log(
            `[Socket] Enviando lotação atual de ${unitRoom.unidade} para ${socket.id}: ${currentCrowd.quantidade_aberta}/${currentCrowd.capacidadeMax}`
          );

          socket.emit('crowd:update', currentCrowd);
        } else {
          console.log(
            `[Socket] Ainda não existe estado de lotação em memória para ${unitRoom.unidade}.`
          );
        }
      }
    });

    socket.on('leave_room', (requestedRoom) => {
      if (!requestedRoom || typeof requestedRoom !== 'string') {
        return;
      }

      const unitRoom = normalizeUnitRoom(requestedRoom);
      const roomToLeave = unitRoom?.room || requestedRoom;

      socket.leave(roomToLeave);

      console.log(
        `[Socket] Cliente ${socket.id} saiu da sala: ${roomToLeave}`
      );
    });

    socket.on('disconnect', (reason) => {
      console.log(
        `[Socket] Cliente desconectado: ${socket.id}. Motivo: ${reason}`
      );
    });
  });

  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io não inicializado.');
  }

  return io;
};