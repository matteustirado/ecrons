const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const barController = require('../controllers/barController');

const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/tv-banners/:unidade', barController.getTvBanners);

router.use(authMiddleware);

router.post('/tv-banners', barController.saveTvBanners);

module.exports = router;