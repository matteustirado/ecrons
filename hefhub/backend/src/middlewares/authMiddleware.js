const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Token ausente ou malformado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({ where: { id: decoded.id || decoded.userId } });

    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Acesso revogado no Hefhub.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

module.exports = { requireAuth };