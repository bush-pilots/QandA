import { Pool } from 'pg';

const pool = new Pool();

const query = (text, params, cb) => pool.query(text, params, cb);

export default query;
