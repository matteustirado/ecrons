const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { authenticator } = require('otplib');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateTokens } = require('../services/jwtService');

const prisma = new PrismaClient();

const loginPhase1 = async (req, res) => {
  try {
    const { username, password, isRedirect } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !user.isActive) {
      await prisma.authLog.create({
        data: { event: 'LOGIN_PHASE_1', status: 'FAILED', reason: 'Invalid credentials or inactive', ipAddress: req.ip }
      });
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      await prisma.authLog.create({
        data: { userId: user.id, event: 'LOGIN_PHASE_1', status: 'FAILED', reason: 'Wrong password', ipAddress: req.ip }
      });
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (!isRedirect && user.role !== 'SUPER_ADMIN') {
      await prisma.authLog.create({
        data: { userId: user.id, event: 'LOGIN_PHASE_1', status: 'FAILED_RBAC', reason: 'Access attempt to Ecrons Dashboard without SUPER_ADMIN role', ipAddress: req.ip }
      });
      return res.status(403).json({ error: 'Acesso Negado. Área restrita a Administradores.', code: 'RBAC_BLOCKED' });
    }

    if (!user.isTotpEnabled) {
      if (isRedirect) {
        const exchangeCode = jwt.sign(
          { id: user.id, exchange: true },
          process.env.JWT_SECRET,
          { expiresIn: '30s' }
        );
        
        await prisma.authLog.create({
          data: { userId: user.id, event: 'LOGIN_SUCCESS', status: 'SUCCESS_EXCHANGE_CODE', ipAddress: req.ip, userAgent: req.headers['user-agent'] }
        });

        return res.status(200).json({ 
          skip2FA: true, 
          exchangeCode,
          message: 'Código de troca gerado.'
        });
      }

      const { accessToken, rawRefreshToken } = await generateTokens(user, req);
      
      await prisma.authLog.create({
        data: { userId: user.id, event: 'LOGIN_SUCCESS', status: 'SUCCESS_NO_2FA', ipAddress: req.ip, userAgent: req.headers['user-agent'] }
      });

      res.cookie('ecrons_refresh_token', rawRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({ 
        skip2FA: true, 
        accessToken,
        message: 'Autenticação rápida concluída.'
      });
    }

    const tempToken = jwt.sign(
      { id: user.id, is2FaPending: true },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    return res.status(200).json({ 
      skip2FA: false,
      message: 'Credenciais validadas. Insira o código 2FA.',
      tempToken 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const loginPhase2 = async (req, res) => {
  try {
    const { tempToken, code, isRedirect } = req.body;

    if (!tempToken || !code) {
      return res.status(400).json({ error: 'Token temporário ou código ausente.' });
    }

    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || !user.isTotpEnabled) {
      return res.status(403).json({ error: 'Configuração de 2FA ausente ou inválida.' });
    }

    const isValid2FA = authenticator.verify({ token: code, secret: user.totpSecret });

    if (!isValid2FA) {
      await prisma.authLog.create({
        data: { userId: user.id, event: 'LOGIN_PHASE_2', status: 'FAILED', reason: 'Invalid TOTP code', ipAddress: req.ip }
      });
      return res.status(401).json({ error: 'Código 2FA inválido.' });
    }

    if (!isRedirect && user.role !== 'SUPER_ADMIN') {
      await prisma.authLog.create({
        data: { userId: user.id, event: 'LOGIN_PHASE_2', status: 'FAILED_RBAC', reason: 'Access attempt to Ecrons Dashboard without SUPER_ADMIN role', ipAddress: req.ip }
      });
      return res.status(403).json({ error: 'Acesso Negado. Área restrita a Administradores.', code: 'RBAC_BLOCKED' });
    }

    if (isRedirect) {
      const exchangeCode = jwt.sign(
        { id: user.id, exchange: true },
        process.env.JWT_SECRET,
        { expiresIn: '30s' }
      );
      
      await prisma.authLog.create({
        data: { userId: user.id, event: 'LOGIN_SUCCESS', status: 'SUCCESS_EXCHANGE_CODE', ipAddress: req.ip, userAgent: req.headers['user-agent'] }
      });

      return res.status(200).json({ exchangeCode });
    }

    const { accessToken, rawRefreshToken } = await generateTokens(user, req);

    await prisma.authLog.create({
      data: { userId: user.id, event: 'LOGIN_SUCCESS', status: 'SUCCESS', ipAddress: req.ip, userAgent: req.headers['user-agent'] }
    });

    res.cookie('ecrons_refresh_token', rawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ accessToken });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sessão de login expirou. Tente novamente.' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const exchangeAccessCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código de troca ausente.' });
    }

    const decoded = jwt.verify(code, process.env.JWT_SECRET);

    if (!decoded.exchange) {
      return res.status(401).json({ error: 'Código inválido para troca.' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Acesso negado ou revogado.' });
    }

    const { accessToken, rawRefreshToken } = await generateTokens(user, req);

    res.cookie('ecrons_refresh_token', rawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(401).json({ error: 'Código de troca expirado ou inválido.' });
  }
};

const verifySSO = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido ou formato inválido.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
      select: { id: true, username: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Acesso revogado ou utilizador inexistente.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

const logout = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies.ecrons_refresh_token;

    if (rawRefreshToken) {
      const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

      await prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() }
      });
    }

    res.clearCookie('ecrons_refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/api/auth/refresh'
    });

    return res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } catch (error) {
    console.error('[ERRO NO LOGOUT]', error);
    return res.status(500).json({ error: 'Erro ao processar logout.' });
  }
};

module.exports = {
  loginPhase1,
  loginPhase2,
  exchangeAccessCode,
  verifySSO,
  logout
};