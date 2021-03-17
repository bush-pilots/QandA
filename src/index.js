import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import query from './db/index';

// Import routes
import indexRouter from './routes/index';
import qaRoutes from './routes/qa';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/qa', qaRoutes);

app.get('/dbtest', (req, res) => {
  query('SELECT * FROM answers', (err, resp) => {
    res.send(resp);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
