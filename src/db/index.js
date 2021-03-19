import { Pool } from 'pg';

const pool = new Pool();

const query = (text, values) => pool.query(text, values);

export default query;
