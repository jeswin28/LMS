const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Question, Quiz } = require('../models');

// Add question to quiz (Instructor only)
exports.addQuestion = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findByPk(req.params.quizId);
    if (!quiz) return next(new ErrorResponse('Quiz not found', 404));
    if (req.user.role !== 'admin' && quiz.instructorId !== req.user.id)
        return next(new ErrorResponse('Not authorized', 403));
    const { text, options, correctOptionIndex } = req.body;
    const question = await Question.create({ quizId: quiz.id, text, options, correctOptionIndex });
    res.status(201).json({ success: true, question });
}); 