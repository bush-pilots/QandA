import query from '../db/index';

exports.queryGetQuestions = async (productId, limit = 5, page = 1) => {
  try {
    const text = `
    SELECT
      q.id AS question_id,
      q.body AS question_body,
      q.created_at AS question_date,
      q.username AS asker_name,
      q.helpfulness AS question_helpfulness,
      q.reported AS question_reported,
      a.id AS answer_id,
      a.body AS answer_body,
      a.created_at AS answer_date,
      a.username AS answerer_name,
      a.helpfulness as answer_helpfulness,
      p.url as photos_url
    FROM questions q
    LEFT JOIN answers a ON a.question_id = q.id
    LEFT JOIN photos p ON p.answer_id = a.id
    WHERE q.product_id = $1 AND q.reported = false
    LIMIT $2
    `;
    const { rows } = await query(text, [productId, limit]);

    const questions = {
      product_id: productId,
      results: [],
    };
    const answers = {
    };
    rows.forEach((row) => {
      answers[row.answer_id] = {
        id: row.answer_id,
        body: row.answer_body,
        date: row.answer_date,
        answerer_name: row.answerer_name,
        helpfulness: row.answer_helpfulness,
        photos: [],
      };
    });
    rows.forEach((row) => {
      if (row.photos_url) {
        answers[row.answer_id].photos.push(row.photos_url);
      }
    });
    rows.forEach((row) => {
      questions.results.push({
        question_id: row.question_id,
        question_body: row.question_body,
        question_date: row.question_date,
        asker_name: row.asker_name,
        question_helpfulness: row.question_helpfulness,
        reported: row.question_reported,
        answers: {
          ...answers,
        },
      });
    });

    return {
      status: true,
      data: questions,
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
