import Question from '../models/Question';

// Return a list of all questions
exports.getQuestions = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { product_id, limit, page } = req.query;
  const results = await Question.queryGetQuestions(product_id, limit, page);
  if (results.status) {
    res.status(200);
  } else {
    res.status(204);
  }
  res.send(results.data);
};

// Add a new question
exports.addQuestion = async (req, res) => {
  const result = await Question.queryAddQuestion(req.body);
  res.status(201);
  res.send(result);
};

exports.markQuestionHelpful = (req, res) => {
  res.send('NOT IMPLEMENTED: Mark a question as helpful');
};

exports.reportQuestion = (req, res) => {
  res.send('NOT IMPLEMENTED: Report a question');
};
