const express = require('express');
const multer = require('multer');
const priceController = require('../controllers/priceController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/state/:unidade', priceController.getState);
router.get('/defaults', priceController.getDefaults);
router.get('/media/:unidade', priceController.getCategoryMedia);
router.get('/holidays/:unidade', priceController.getHolidays);
router.get('/promotions/:unidade', priceController.getPromotions);

router.use(requireAuth);

router.put('/state/:unidade', priceController.updateState);
router.put('/defaults', priceController.updateDefault);
router.put('/media', priceController.updateCategoryMedia);
router.post('/holidays', priceController.addHoliday);
router.delete('/holidays/:id', priceController.deleteHoliday);
router.post('/promotions', priceController.addPromotion);
router.post('/upload', upload.single('priceMedia'), priceController.uploadPriceMedia);

module.exports = router;