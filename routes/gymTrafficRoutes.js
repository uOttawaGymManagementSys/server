const express = require("express");
const router = express.Router();
const {
  getTraffic,
  getTrafficByGym,
  addTrafficCount,
} = require("../controllers/gymTrafficController");

router.get("/", getTraffic);

router.get("/gym/:gymId", getTrafficByGym); // id 3 for MNT and 4 for HLC

router.post("/add", addTrafficCount);

module.exports = router;
