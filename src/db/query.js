const { Pool } = require('pg');

const pool = new Pool();

module.exports = {
  async query(text, params) {
    const timestamp = new Date();

    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - timestamp;

      console.log('query ran', {
        duration,
        rows: res.rowCount,
        text,
      });

      return res;
    } catch (error) {
      console.log('error in query', { text });

      throw error;
    }
  },
};
