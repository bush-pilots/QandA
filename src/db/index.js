const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'qaapidb',
  password: 'postgres',
  port: 5432,
});

const query = (text, values) => pool.query(text, values);

module.exports = query;