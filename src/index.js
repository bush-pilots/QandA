import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Welcome to my world!'));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
