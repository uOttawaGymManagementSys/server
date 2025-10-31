const client = require("../db");

const getMachines = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM machine_stats
      ORDER BY status_changed_at ASC;
    `);

    console.log("MACHINE STATUS DATA FROM DATABASE:");
    console.table(result.rows); // <-- THIS prints the table

    res.status(200).json(result.rows); // <-- This sends data to the client
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

    res.status(200).json(result.rows); // <-- This sends data to the client
  } catch (error) {
    console.error("Error fetching machines by gym:", error);
    res.status(500).json({ message: "Error fetching machines by gym" });
  }
};

// POST Update the status of a specific machine
const updateMachineStatus = async (req, res) => {
  try {
    const { id, status } = req.body; // expected from the request body

    if (!id || typeof status === "undefined") {
      return res
        .status(400)
        .json({ message: "Machine ID and status are required." });
    }

    const result = await client.query(
      `
      UPDATE machine_stats
      SET status = $1,
          status_changed_at = NOW()
      WHERE id = $2
      RETURNING *;
      `,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Machine not found." });
    }

    console.log(`Machine ID ${id} status updated to ${status}`);
    res.status(200).json({
      message: "Machine status updated successfully.",
      updatedMachine: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating machine status:", error);
    res.status(500).json({ message: "Error updating machine status." });
  }
};

module.exports = { getMachines, getMachinesByGym, updateMachineStatus };
