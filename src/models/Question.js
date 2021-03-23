import query from '../db/index';
import Answers from './Answer';

exports.queryGetQuestions = async (productId, limit = 5, page = 1) => {
  try {
    const text = `
    SELECT
    id AS question_id,
    body AS question_body,
    created_at AS question_date,
    username AS asker_name,
    helpfulness AS question_helpfulness,
    reported
    FROM questions
    WHERE product_id = $1
    LIMIT $2
    `;
    const { rows } = await query(text, [productId, limit]);
    const questions = await Promise.all(rows.map(async (question) => ({
      ...question,
      answers: await Answers.queryGetAnswers(question.question_id, limit, page, true),
    })));
    return {
      status: true,
      data: { product_id: productId, results: questions },
    };
  } catch (error) {
    return { status: false, data: error };
  }
};

exports.queryAddQuestion = async ({
  body, username, email, productId,
}) => {
  try {
    const results = await query({
      text: 'INSERT INTO questions (product_id, body, username, email) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [productId, body, username, email],
    });
    return { status: true, data: results };
  } catch (error) {
    return { status: false, data: error };
  }
};

exports.queryMarkQuestionHelpful = async (questionId) => {
  try {
    const result = await query(
      `UPDATE questions
       SET helpfulness = helpfulness + 1
       WHERE id = $1`, [questionId],
    );
    return { status: true, data: result };
  } catch (error) {
    return { status: false, data: error };
  }
};

exports.queryReportQuestion = async (questionId) => {
  try {
    const result = await query(
      `UPDATE questions
       SET reported = $1
       WHERE id = $2`, [true, questionId],
    );
    return { status: true, data: result };
  } catch (error) {
    return { status: false, data: error };
  }
};
