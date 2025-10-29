const client = require("../db");

const getTraffic = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM traffic_stats
      ORDER BY recorded_at ASC;
    `);

    console.log("TRAFFIC DATA FROM DATABASE:");
    console.table(result.rows); // <-- THIS prints the table

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    res.status(500).json({ message: "Error fetching traffic data" });
  }
};

module.exports = getTraffic;
