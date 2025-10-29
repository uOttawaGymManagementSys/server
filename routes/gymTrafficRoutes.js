const express = require('express');
const router = express.Router();
const getTraffic = require('../controllers/gymTrafficController');

router.get('/', getTraffic);

module.exports = router;