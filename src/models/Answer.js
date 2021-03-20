import Photos from './Photos';
import query from '../db/index';

exports.queryGetAnswers = async (questionId, limit = 5, page = 1, forQorA) => {
  const textForQ = `
    SELECT id, body, created_at AS date, username as answerer_name, helpfulness
    FROM answers
    WHERE question_id = $1
    LIMIT $2
  `;

  const textForA = `
    SELECT id AS answer_id, body, created_at AS date, username AS answerer_name, helpfulness
    FROM answers
    WHERE question_id = $1
    LIMIT $2
  `;

  const { rows } = await query(forQorA ? textForQ : textForA, [questionId, limit]);
  const answers = await Promise.all(rows.map(async (answer) => ({
    ...answer,
    photos: await Photos.queryGetPhotos(answer.id),
  }), {}));
  const reduced = answers.reduce((acc, answer) => ({
    ...acc,
    [forQorA ? answer.id : answer.answer_id]: answer,
  }), {});

  return forQorA
    ? reduced
    : {
      question: questionId,
      page,
      count: limit,
      results: answers,
    };
};

// exports.queryGetAnswers = async (questionId, limit = 5, page = 1) => {

//   const { rows } = await query(text, [questionId, limit]);
//   const answers = await Promise.all(rows.map(async (answer) => ({
//     ...answer,
//     photos: await Photos.queryGetPhotos(answer.id),
//   })));
//   // const reduced = answers.reduce((acc, answer) => ({ ...acc, [answer.answer_id]: answer }), {});

// };

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
