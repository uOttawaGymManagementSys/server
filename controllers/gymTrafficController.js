const client = require("../db");

// GET ALL traffic
const getTraffic = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM traffic_stats
      ORDER BY recorded_at ASC;
    `);

    console.log("ALL TRAFFIC DATA:");
    console.table(result.rows);

    res.status(200).json(result.rows); // <-- This sends data to the client
  } catch (error) {
    console.error("Error fetching all traffic:", error);
    res.status(500).json({ message: "Error fetching all traffic" });
  }
};

// GET traffic by gym_id
const getTrafficByGym = async (req, res) => {
  try {
    const { gymId } = req.params;

    const result = await client.query(
      `SELECT * FROM traffic_stats WHERE gym_id = $1 ORDER BY recorded_at ASC;`,
      [gymId]
    );

    console.log(`TRAFFIC FOR GYM ID ${gymId}`);
    console.table(result.rows);

    res.status(200).json(result.rows); // <-- This sends data to the client
  } catch (error) {
    console.error("Error fetching traffic by gym:", error);
    res.status(500).json({ message: "Error fetching traffic by gym" });
  }
};

// Get Today's traffic by gym_id
const getTodayTrafficByGym = async (req, res) => {
  try {
    const { gymId } = req.params;

    const result = await client.query(
      `
      SELECT * FROM traffic_stats
      WHERE gym_id = $1
        AND recorded_at >= CURRENT_DATE
        AND recorded_at < CURRENT_DATE + INTERVAL '1 day'
      ORDER BY recorded_at ASC;
      `,
      [gymId]
    );

    console.log(`Today's traffic for gym ${gymId}`);
    console.table(result.rows);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching today's traffic by gym: error");
    res.status(500).json({ message: "Error fetching today's traffic by gym" });
  }
};

//POST traffic count
const addTrafficCount = async (req, res) => {
  try {
    const { gym_id, traffic_count } = req.body;

    if (!gym_id || !traffic_count) {
      return res
        .status(400)
        .json({ message: "both gym_id and traffic_count are required." });
    }

    // Insert new record into table traffic_stats
    const result = await client.query(
      `INSERT INTO traffic_stats (gym_id, traffic_count, recorded_at)
       VALUES ($1, $2, NOW())
       RETURNING *;
      `,
      [gym_id, traffic_count]
    );

    console.log(`New traffic record added for gym ${gym_id}: ${traffic_count}`);
    res.status(201).json({
      message: "Traffic count added successfully.",
      newRecord: result.rows[0],
    });
  } catch (error) {
    console.log("Error adding traffic count: ", error);
    res.status(500).json({ message: "Error adding traffic count." });
  }
};

module.exports = {
  getTraffic,
  getTrafficByGym,
  addTrafficCount,
  getTodayTrafficByGym,
};
