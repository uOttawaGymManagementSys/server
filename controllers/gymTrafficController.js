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

// GET latest traffic record by gym_id
const getLatestTrafficByGym = async (req, res) => {
  try {
    const { gymId } = req.params;

    const result = await client.query(
      `
      SELECT *
      FROM traffic_stats
      WHERE gym_id = $1
      ORDER BY recorded_at DESC
      LIMIT 1;
      `,
      [gymId]
    );

    if (result.rows.length === 0) {
      console.log(`No traffic records found for gym ID ${gymId}`);
      // you can choose 200 + null or 404; I’d lean 200 with null for convenience
      return res.status(200).json(null);
    }

    console.log(`LATEST TRAFFIC FOR GYM ID ${gymId}`);
    console.table(result.rows);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching latest traffic by gym:", error);
    res.status(500).json({ message: "Error fetching latest traffic by gym" });
  }
};

// GET traffic stats by gym with range + aggregation
const getTrafficStatsByGym = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { range = "week", agg = "daily_max" } = req.query; // defaults

    if (!gymId) {
      return res.status(400).json({ message: "gymId is required." });
    }

    let query = "";
    const params = [gymId];

    if (agg === "daily_max") {
      // ---- DAILY MAX CASES ----
      if (range === "week") {
        // Last full calendar week: Monday–Sunday of last week
        query = `
          SELECT
            DATE_TRUNC('day', recorded_at) AS day,
            MAX(traffic_count) AS peak_traffic
          FROM traffic_stats
          WHERE gym_id = $1
            AND recorded_at >= date_trunc('week', CURRENT_DATE) - INTERVAL '7 days'
            AND recorded_at <  date_trunc('week', CURRENT_DATE)
          GROUP BY day
          ORDER BY day ASC;
        `;
      } else if (range === "month") {
        // Last full calendar month (e.g. all of November if today is in December)
        query = `
          SELECT
            DATE_TRUNC('day', recorded_at) AS day,
            MAX(traffic_count) AS peak_traffic
          FROM traffic_stats
          WHERE gym_id = $1
            AND recorded_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
            AND recorded_at <  date_trunc('month', CURRENT_DATE)
          GROUP BY day
          ORDER BY day ASC;
        `;
      } else if (range === "6months") {
        // Last 6 calendar months, grouped by day
        query = `
          SELECT
            DATE_TRUNC('day', recorded_at) AS day,
            MAX(traffic_count) AS peak_traffic
          FROM traffic_stats
          WHERE gym_id = $1
            AND recorded_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '6 months'
            AND recorded_at <  date_trunc('month', CURRENT_DATE)
          GROUP BY day
          ORDER BY day ASC;
        `;
      } else {
        return res
          .status(400)
          .json({ message: `Unsupported range for daily_max: ${range}` });
      }
    } else if (agg === "monthly_max") {
      // ---- MONTHLY MAX CASES ----
      if (range === "6months") {
        // Last 6 calendar months, grouped by month
        query = `
          SELECT
            DATE_TRUNC('month', recorded_at) AS day,
            MAX(traffic_count) AS peak_traffic
          FROM traffic_stats
          WHERE gym_id = $1
            AND recorded_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '6 months'
            AND recorded_at <  date_trunc('month', CURRENT_DATE)
          GROUP BY day
          ORDER BY day ASC;
        `;
      } else {
        return res
          .status(400)
          .json({ message: `Unsupported range for monthly_max: ${range}` });
      }
    } else {
      return res.status(400).json({ message: `Unsupported agg: ${agg}` });
    }

    const result = await client.query(query, params);

    console.log(`STATS (agg=${agg}, range=${range}) for gym ${gymId}:`);
    console.table(result.rows);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching traffic stats by gym:", error);
    res.status(500).json({ message: "Error fetching traffic stats by gym" });
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
  getLatestTrafficByGym,
  getTrafficStatsByGym,
};
