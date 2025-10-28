const client = require('../main');

const MachineStat = {
  async getAll() {
    const res = await client.query(`
      SELECT m.*, g.name AS gym_name
      FROM machine_stats m
      JOIN gyms g ON m.gym_id = g.id
      ORDER BY m.id ASC
    `);
    return res.rows;
  },

  async getByGymId(gymId) {
    const res = await client.query(
      `SELECT * FROM machine_stats
       WHERE gym_id = $1
       ORDER BY status_changed_at DESC`,
      [gymId]
    );
    return res.rows;
  },

  async create({ name, number, status, gym_id }) {
    const res = await client.query(
      `INSERT INTO machine_stats (name, number, status, gym_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, number, status, gym_id]
    );
    return res.rows[0];
  },

  async updateStatus({ id, status }) {
    const res = await client.query(
      `UPDATE machine_stats
       SET status = $1,
           status_changed_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    return res.rows[0];
  },
};

module.exports = MachineStat;
