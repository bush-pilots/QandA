import Question from '../models/Question';

// Return a list of all questions
exports.getQuestions = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { product_id, limit, page } = req.query;
  const { status, data } = await Question.queryGetQuestions(product_id, limit, page);
  if (status) {
    res.status(200);
  } else {
    res.status(404);
  }
  res.send(data);
};

// Add a new question
exports.addQuestion = async (req, res) => {
  const { status, data } = await Question.queryAddQuestion(req.body);
  if (status) {
    res.status(201);
  } else {
    res.status(422);
  }
  res.send(data);
};

exports.markQuestionHelpful = async (req, res) => {
  const { status } = await Question.queryMarkQuestionHelpful(req.params.question_id);
  if (status) {
    res.status(204);
  } else {
    res.status(422);
  }
  res.end();
};

exports.reportQuestion = async (req, res) => {
  const { status } = await Question.queryReportQuestion(req.params.question_id);
  if (status) {
    res.status(204);
  } else {
    res.status(422);
  }
  res.end();
};
