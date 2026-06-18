const express = require('express');
const rateLimit = require('express-rate-limit');
const { loginPhase1, loginPhase2, exchangeAccessCode, verifySSO, logout } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas de acesso. Bloqueio temporário ativo.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login/step1', loginLimiter, loginPhase1);
router.post('/login/step2', loginLimiter, loginPhase2);
router.post('/exchange', exchangeAccessCode);
router.post('/logout', logout);

router.get('/verify', verifySSO);

router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({ 
    id: req.user.id, 
    role: req.user.role 
  });
});

module.exports = router;