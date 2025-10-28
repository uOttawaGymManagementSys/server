const client = require('../main');

const TrafficStat = {
  async getAll() {
    const res = await client.query(`
      SELECT t.*, g.name AS gym_name
      FROM traffic_stats t
      JOIN gyms g ON t.gym_id = g.id
      ORDER BY t.recorded_at DESC
    `);
    return res.rows;
  },

  async getByGymId(gymId) {
    const res = await client.query(
      `SELECT * FROM traffic_stats
       WHERE gym_id = $1
       ORDER BY recorded_at DESC`,
      [gymId]
    );
    return res.rows;
  },

  async create({ traffic_count, gym_id }) {
    const res = await client.query(
      `INSERT INTO traffic_stats (traffic_count, gym_id)
       VALUES ($1, $2)
       RETURNING *`,
      [traffic_count, gym_id]
    );
    return res.rows[0];
  },
};

module.exports = TrafficStat;
