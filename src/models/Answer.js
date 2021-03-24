import Photos from './Photos';
import query from '../db/index';

exports.queryGetAnswers = async (questionId, limit = 5, page = 1) => {
  try {
    const text = `
        SELECT a.id AS id, a.body, a.created_at AS date, a.username AS answerer_name, a.helpfulness, p.url
        FROM answers a
        LEFT JOIN photos p ON p.id = a.id
        WHERE a.question_id = $1 AND a.reported = false
        LIMIT $2
      `;
    const { rows } = await query(text, [questionId, limit]);

    const response = {
      question: questionId,
      page: 1,
      count: limit,
      results: [],
    };

    rows.forEach((row) => {
      const answer = {
        id: null,
        body: null,
        date: null,
        helpfulness: null,
        photos: [],
      };
      if (answer.id && (answer.id === row.answers_id)) {
        answer.photos = [...answer.photos, row.url];
      } else {
        answer.id = row.id;
        answer.body = row.body;
        answer.date = row.date;
        answer.helpfulness = row.helpfulness;
        answer.photos = [...answer.photos, row.url];
      }
      response.results.push(answer);
    });

    return {
      status: true,
      data: response,
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
      id: 0,
      photo_ids: [],
    };
    const answerResult = await query(text, [body, questionId, username, email]);

    // add answer id to results
    results.id = answerResult.rows[0].id;
    results.photo_ids = await Promise.all(photos.map(async (url) => {
      const photoResult = await Photos.queryInsertPhoto(url, results.id);
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
