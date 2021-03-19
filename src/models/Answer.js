import Photos from './Photos';
import query from '../db/index';

exports.queryGetAnswers = (questionId) => {
  const { rows } = query('SELECT * FROM answers WHERE question_id = $1', questionId);
  const photos = Photos.queryGetPhotos(rows[0].id);

  return {
    rows, photos,
  };
};

exports.queryAddAnswer = ({ body, helpfulness }, questionId) => {
  const { rows } = query(
    ` INSERT INTO answers (
        body,
        a_helpfulness,
        question_id)
      VALUES ($1, $2)' [${body}, ${helpfulness}, ${questionId}]`,
  );
  return rows;
};

exports.queryUpdateAnswer = ({ body, helpfulness }, answerId) => {
  const { rows } = query(
    `UPDATE answers
     SET body = ${body}, a_helpfulness = ${helpfulness}
     WHERE id = ${answerId}`,
  );
  return rows;
};
