import Answer from '../models/Answer';

// Return exports list of exportsnswers for exports specific question
exports.getAnswers = async (req, res) => {
  const results = await Answer.queryGetAnswers(
    req.params.question_id,
    req.query.limit,
    req.query.page,
  );
  res.send(results);
};

exports.addNewAnswer = (req, res) => {
  res.send('NOT IMPLEMENTED: Add a new Answer');
};

exports.markAnswerHelpful = (req, res) => {
  res.send('NOT IMPLEMENTED: Mark answer as helpful');
};

exports.reportAnswer = (req, res) => {
  res.send('NOT IMPLEMENTED: Report an answer');
};
