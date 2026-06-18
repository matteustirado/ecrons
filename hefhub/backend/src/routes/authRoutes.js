const express = require('express');
const { exchangeCode } = require('../controllers/authController');

const router = express.Router();

router.post('/exchange', exchangeCode);

module.exports = router;