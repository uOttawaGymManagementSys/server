const express = require("express");
const router = express.Router();
const {
  getTraffic,
  getTrafficByGym,
  addTrafficCount,
  getTodayTrafficByGym,
  getLatestTrafficByGym,
  getTrafficStatsByGym,
} = require("../controllers/gymTrafficController");

router.get("/", getTraffic);

router.get("/gym/:gymId", getTrafficByGym); // id 3 for MNT and 4 for HLC

router.get("/gym/:gymId/today", getTodayTrafficByGym);

router.get("/latest/gym/:gymId", getLatestTrafficByGym);

router.get("/gym/:gymId/stats", getTrafficStatsByGym);

router.post("/add", addTrafficCount);

module.exports = router;
