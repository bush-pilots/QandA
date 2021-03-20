import query from '../db/index';
import Answer from './Answer';

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
      answers: await Answer.queryGetAnswers(question.question_id, limit, page, true),
    })));
    return {
      status: true,
      data: { product_id: productId, results: questions },
    };
  } catch (error) {
    return { status: false, data: 'Product does not contain any questions.' };
  }
};

exports.queryAddQuestion = async ({
  body, reported, helpfulness, username, email, productId,
}) => {
  try {
    const { rows } = await query({
      text: 'INSERT INTO questions (product_id, body, username, email, reported, helpfulness) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [productId, body, username, email, reported, helpfulness],
    });
    const [record] = rows;
    return { status: true, data: record };
  } catch (error) {
    return { status: false, data: error };
  }
};
