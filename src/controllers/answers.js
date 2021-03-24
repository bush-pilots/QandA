import Answer from '../models/Answer';

// Return exports list of exportsnswers for exports specific question
exports.getAnswers = async (req, res) => {
  const { status, data } = await Answer.queryGetAnswers(
    req.params.question_id,
    req.query.limit,
    req.query.page,
  );
  if (status) {
    res.status(200);
  } else {
    res.status(404);
  }
  res.send(data);
};

exports.addNewAnswer = async (req, res) => {
  console.log(req.body);
  const { status, data } = await Answer.queryAddAnswer(req.body);
  if (status) {
    res.status(201);
  } else {
    res.status(422);
  }
  res.send(data);
};

exports.markAnswerHelpful = async (req, res) => {
  const { status } = await Answer.queryMarkAnswerHelpful(req.params.answer_id);
  if (status) {
    res.status(204);
  } else {
    res.status(422);
  }
  res.end();
};

exports.reportAnswer = async (req, res) => {
  const { status } = await Answer.queryReportAnswer(req.params.answer_id);
  if (status) {
    res.status(204);
  } else {
    res.status(422);
  }
  res.end();
};
