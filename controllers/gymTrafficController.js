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

    res.status(200).json(result.rows);
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

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching traffic by gym:", error);
    res.status(500).json({ message: "Error fetching traffic by gym" });
  }
};

module.exports = { getTraffic, getTrafficByGym };
