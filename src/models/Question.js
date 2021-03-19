import query from '../db/index';

exports.queryGetQuestions = async (productId) => {
  try {
    const { rows } = await query('SELECT * FROM questions WHERE product_id = $1 LIMIT', [productId]);
    return rows;
  } catch (error) {
    return ('Product does not contain any questions.');
  }
};

exports.queryAddQuestion = async ({
  id, body, reported, helpfulness, usernameId, productId, createdAt,
}) => {
  try {
    const { rows } = await query({
      text: 'INSERT INTO questions (id, body, reported, helpfulness, username_id, product_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      values: [id, body, reported, helpfulness, usernameId, productId, createdAt],
    });
    return rows;
  } catch (error) {
    return (error.detail);
  }
};
