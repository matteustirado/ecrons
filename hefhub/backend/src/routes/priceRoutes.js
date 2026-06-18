const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const priceController = require('../controllers/priceController');

const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/state/:unidade', priceController.getState);
router.get('/defaults', priceController.getDefaults);
router.get('/media/:unidade', priceController.getCategoryMedia);
router.get('/promotions/:unidade', priceController.getPromotions);
router.get('/holidays/:unidade', priceController.getHolidays);

router.use(authMiddleware);

router.post('/state/:unidade', priceController.updateState);
router.post('/defaults', priceController.updateDefault);
router.post('/media', priceController.updateCategoryMedia);
router.post('/upload', upload.single('mediaFile'), priceController.uploadPriceMedia);
router.post('/promotions', priceController.addPromotion);
router.post('/holidays', priceController.addHoliday);
router.delete('/holidays/:id', priceController.deleteHoliday);

module.exports = router;