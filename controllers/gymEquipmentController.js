const client = require("../db");

const getMachines = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM machine_stats
      ORDER BY status_changed_at ASC;
    `);

    console.log("MACHINE STATUS DATA FROM DATABASE:");
    console.table(result.rows); // <-- THIS prints the table

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching machines data:", error);
    res.status(500).json({ message: "Error fetching machines data" });
  }
};

// GET machines by gym_id
const getMachinesByGym = async (req, res) => {
  try {
    const { gymId } = req.params;

    const result = await client.query(
      `SELECT * FROM machine_stats WHERE gym_id = $1 ORDER BY status_changed_at ASC;`,
      [gymId]
    );

    console.log(`Machines FOR GYM ID ${gymId}`);
    console.table(result.rows);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching machines by gym:", error);
    res.status(500).json({ message: "Error fetching machines by gym" });
  }
};

module.exports = {getMachines, getMachinesByGym};