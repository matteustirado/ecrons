const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
let io;

exports.initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('Token ausente');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.id || decoded.userId } });

      if (!user || !user.isActive) throw new Error('Usuário inativo');

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Acesso não autorizado ao WebSocket'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`role_${socket.user.role}`);
    
    socket.on('disconnect', () => {
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