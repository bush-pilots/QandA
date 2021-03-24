import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/qa');
});

router.get('/payload', (req, res) => {
  res.status(200);
  res.sendFile('/var/www/app/payload.json');
});

module.exports = router;
