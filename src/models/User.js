import query from '../db/index';

exports.queryGetUser = async (username) => {
  const { rows } = await query('SELECT * FROM users WHERE username = $1;', [username]);

  return rows;
};
