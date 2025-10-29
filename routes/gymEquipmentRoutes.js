const express = require('express');
const router = express.Router();
const getTraffic = require('../controllers/gymEquipmentController');

router.get('/', getTraffic);

module.exports = router;