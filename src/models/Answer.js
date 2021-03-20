import Photos from './Photos';
import query from '../db/index';

exports.queryGetAnswers = async (questionId, limit = 5, page = 1, forQorA) => {
  try {
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

    const forAnswerResult = {
      question: questionId,
      page,
      count: limit,
      results: answers,
    };

    return forQorA
      ? { status: true, data: reduced }
      : { status: true, data: forAnswerResult };
  } catch (error) {
    return { status: false, data: error };
  }
};

exports.queryAddAnswer = async (params) => {
  try {
    const {
      body,
      helpfulness,
      questionId,
      username,
      email,
    } = params;
    const text = `
      INSERT INTO answers (
        body,
        helpfulness,
        question_id,
        username,
        email
      )
      VALUES ($1, $2, $3, $4, $5);
    `;
    const result = await query(text, [body, helpfulness, questionId, username, email]);
    return { status: true, data: result };
  } catch (error) {
    return { status: false, data: error };
  }
};

exports.queryReportAnswer = (answerId) => {
  const { rows } = query(
    `UPDATE answers
     SET reported = TRUE
     WHERE id = $1}`, [answerId],
  );
  return rows;
};
