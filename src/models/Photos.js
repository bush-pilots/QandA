import query from '../db/index';

exports.queryGetPhotos = async (answerId) => {
  const { rows } = await query('SELECT * FROM photos WHERE answer_id = $1', [answerId]);
  // console.log('Photos at query: ', rows);
  return rows;
};

exports.queryInsertPhotos = async (url, answerId) => {
  const { rows } = await query('INSERT INTO photos (url, answer_id) VALUES ($1, $2)', [url, answerId]);
  return rows;
};
