const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const appController = require('../controllers/appController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const themeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: { error: 'Limite de requisições de tema excedido.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/theme', themeLimiter, appController.getThemeByUrl);

router.get('/', requireAuth, requireAdmin, appController.getAllApps);
router.post('/', requireAuth, requireAdmin, upload.single('logo'), appController.createApp);
router.put('/:id', requireAuth, requireAdmin, upload.single('logo'), appController.updateApp);
router.put('/:id/toggle', requireAuth, requireAdmin, appController.toggleAppStatus);

module.exports = router;