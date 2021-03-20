import express from 'express';

// Require Controller modules
import q from '../controllers/questions';

// Require Controller modules
import a from '../controllers/answers';

const router = express.Router();

// Landing API call
router.get('/questions', q.getQuestions);

// Get Answers
router.get('/questions/:question_id/answers', a.getAnswers);

// Add a question
router.post('/questions', q.addQuestion);

// Add an answer
router.post('/questions/:question_id/answers', a.addNewAnswer);

// Mark a question helpful
router.put('/questions/:question_id/helpful', q.markQuestionHelpful);

// Report a question
router.put('/questions/:question_id/report', q.reportQuestion);

// Mark an answer helpful
router.put('/answers/:answer_id/helpful', a.markAnswerHelpful);

// Report an answer
router.put('/answers/:answer_id/report', a.reportAnswer);

module.exports = router;
