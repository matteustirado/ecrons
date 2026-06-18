const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateTokens = async (user, req) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  });

  return { accessToken, rawRefreshToken };
};

module.exports = { generateTokens };