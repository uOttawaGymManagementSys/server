const express = require('express');
const router = express.Router();
const {getMachines, getMachinesByGym} = require('../controllers/gymEquipmentController');

router.get('/', getMachines);

router.get('/gym/:gymId', getMachinesByGym); // id 3 for MNT and 4 for HLC

module.exports = router;