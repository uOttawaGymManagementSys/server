const express = require("express");
const router = express.Router();
const {
  getTraffic,
  getTrafficByGym,
  addTrafficCount,
  getTodayTrafficByGym,
  getLatestTrafficByGym,
} = require("../controllers/gymTrafficController");

router.get("/", getTraffic);

router.get("/gym/:gymId", getTrafficByGym); // id 3 for MNT and 4 for HLC

router.get("/gym/:gymId/today", getTodayTrafficByGym);

router.get("/latest/gym/:gymId", getLatestTrafficByGym);

router.post("/add", addTrafficCount);

module.exports = router;
