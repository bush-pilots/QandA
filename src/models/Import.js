/* eslint-disable camelcase */
const query = require('../db/index');

exports.queryImportQuestion = async ({
  id,
  product_id,
  body,
  date_written,
  reported,
  helpful,
}) => {
  try {
    const text = `
    INSERT INTO questions(
      id,
      product_id,
      body,
      created_at,
      reported,
      helpful
    )
    VALUES (
      $1, $2, $3, $4, $5, $6
    );
    `;
    const result = await query(text, [
      Number(id),
      Number(product_id),
      String(body),
      Date(date_written),
      Boolean(reported),
      Number(helpful),
    ]);
    console.log('i was called: ', result);
    return result;
  } catch (error) {
    return error;
  }
};

exports.queryImportUser = async ({
  asker_name,
  asker_email,
}) => {
  try {
    const text = `
    INSERT INTO users (
      username,
      email
    )
    VALUES (
      $1, $2
    )
    `;
    const result = await query(text, [asker_name, asker_email]);
    return result;
  } catch (error) {
    return error;
  }
};

exports.queryImportAnswers = async ({
  id,
  question_id,
  body,
  date_written,
  reported,
  helpful,
}) => {
  try {
    const text = `
    INSERT INTO answers (
      id,
      question_id,
      body,
      created_at,
      reported,
      helpful
    )
    VALUES (
      $1, $2, $3, $4, $5, $6
    )
    `;
    const result = query(text, [
      Number(id),
      Number(question_id),
      String(body),
      Date(date_written),
      Boolean(reported),
      Number(helpful),
    ]);
    return result;
  } catch (error) {
    return error;
  }
};

exports.queryImportPhotos = async ({
  id,
  answer_id,
  url,
}) => {
  try {
    const text = `
    INSERT INTO photos (
      id,
      answer_id,
      url
    )
    VALUES (
      $1, $2, $3
    )
    `;
    const result = query(text, [id, answer_id, url]);
    return result;
  } catch (error) {
    return error;
  }
};
