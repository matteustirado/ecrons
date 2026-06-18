const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        isTotpEnabled: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('[ERRO API]', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role, isTotpEnabled } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username já existe.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: passwordHash,
        role: role || 'USER',
        isTotpEnabled: isTotpEnabled !== undefined ? isTotpEnabled : true
      },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        isTotpEnabled: true,
        createdAt: true
      }
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('[ERRO API]', error);
    return res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, isTotpEnabled } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (isTotpEnabled !== undefined) updateData.isTotpEnabled = isTotpEnabled;
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        isTotpEnabled: true,
        createdAt: true
      }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('[ERRO API]', error);
    return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('[ERRO API]', error);
    return res.status(500).json({ error: 'Erro ao alterar status do usuário.' });
  }
};