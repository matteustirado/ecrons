const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Token ausente ou malformado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Acesso restrito. Privilégios insuficientes para esta operação.' });
  }
};

module.exports = { requireAuth, requireAdmin };