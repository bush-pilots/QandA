import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { Client } from 'node-postgres';

/*
===== PoostgreSQL Connection
*/

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGDBPASSWD,
  port: process.env.PGPORT,
});

client.connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Welcome to my world!'));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
