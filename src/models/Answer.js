import Photos from './Photos';
import query from '../db/index';

exports.queryGetAnswers = async (questionId, limit = 5, page = 1) => {
  try {
    const text = `
        SELECT id AS answer_id, body, created_at AS date, username AS answerer_name, helpfulness
        FROM answers
        WHERE question_id = $1 AND reported = false
        LIMIT $2
      `;
    const results = await query(text, [questionId, limit]);
    const answers = await Promise.all(results.rows.map(async (answer) => ({
      ...answer,
      photos: await Photos.queryGetPhotos(answer.id),
    }), {}));

    return {
      status: true,
      data: {
        question: questionId,
        page,
        count: limit,
        results: answers,
      },
    };
  } catch (error) {
    return { status: false, data: error };
  }
};

exports.queryAddAnswer = async (params) => {
  try {
    const {
      body,
      questionId,
      username,
      email,
      photos,
    } = params;
    const text = `
      INSERT INTO answers (
        body,
        question_id,
        username,
        email
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const results = {
      answer_id: 0,
      photo_ids: [],
    };
    const answerResult = await query(text, [body, questionId, username, email]);

    // add answer id to results
    results.answer_id = answerResult.rows[0].id;
    results.photo_ids = await Promise.all(photos.map(async (url) => {
      const photoResult = await Photos.queryInsertPhoto(url, results.answer_id);
      return photoResult.rows[0].id;
    }));
    return { status: true, data: results };
  } catch (error) {
    return { status: false, data: error };
  }
};

exports.queryMarkAnswerHelpful = async (answerId) => {
  try {
    const result = await query(
      `UPDATE answers
       SET helpfulness = helpfulness + 1
       WHERE id = $1`, [answerId],
    );
    return { status: true, data: result };
  } catch (error) {
    return { status: false, data: error };
  }
};

exports.queryReportAnswer = async (answerId) => {
  try {
    const result = await query(
      `UPDATE answers
       SET reported = $1
       WHERE id = $2`, [true, answerId],
    );
    return { status: true, data: result };
  } catch (error) {
    return { status: false, data: error };
  }
};
