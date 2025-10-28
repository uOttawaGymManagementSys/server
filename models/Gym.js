const client = require('../main');

const Gym = {
  async getAll() {
    const res = await client.query('SELECT * FROM gyms ORDER BY id ASC');
    return res.rows;
  },

  async getById(id) {
    const res = await client.query('SELECT * FROM gyms WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create({ name, address }) {
    const res = await client.query(
      `INSERT INTO gyms (name, address)
       VALUES ($1, $2)
       RETURNING *`,
      [name, address]
    );
    return res.rows[0];
  },

  async update(id, { name, address }) {
    const res = await client.query(
      `UPDATE gyms
       SET name = $1, address = $2
       WHERE id = $3
       RETURNING *`,
      [name, address, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    await client.query('DELETE FROM gyms WHERE id = $1', [id]);
    return { message: 'Gym deleted successfully' };
  }
};

module.exports = Gym;
