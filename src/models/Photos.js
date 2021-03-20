import query from '../db/index';

exports.queryGetPhotos = async (answerId) => {
  const { rows } = await query('SELECT * FROM photos WHERE answer_id = $1', [answerId]);
  // console.log('Photos at query: ', rows);
  return rows;
};

exports.queryInsertPhoto = async (url, answerId) => {
  const results = await query('INSERT INTO photos (url, answer_id) VALUES ($1, $2) RETURNING id', [url, answerId]);
  return results;
};
