const express = require('express');
const multer = require('multer');
const scoreboardController = require('../controllers/scoreboardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
});

router.get('/active/:unidade', scoreboardController.getActiveConfig);
router.post('/active', authMiddleware, scoreboardController.saveActiveConfig);

router.get('/presets/:unidade', scoreboardController.getPresets);
router.post('/presets', authMiddleware, scoreboardController.savePreset);
router.delete('/presets/:id', authMiddleware, scoreboardController.deletePreset);

router.get('/history/:unidade', authMiddleware, scoreboardController.getHistory);

router.post('/upload', authMiddleware, upload.single('scoreboardImage'), scoreboardController.uploadImage);

router.post('/vote', authMiddleware, scoreboardController.castVote);
router.get('/votes/:unidade', scoreboardController.getVotes);

module.exports = router;