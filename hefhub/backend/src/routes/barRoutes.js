const express = require('express');
const barController = require('../controllers/barController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/ocupacao', barController.getOcupacao);
router.get('/precos-atuais', barController.getPrecosAtuais);
router.get('/pulseira', barController.getPulseira);

module.exports = router;