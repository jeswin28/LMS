// lms-backend/controllers/quizController.js
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Quiz, Question, QuizAttempt, Course, Enrollment } = require('../models');
const { createNotification } = require('./notificationController'); // Import notification helper

// @desc      Get all quizzes (available to the user based on role/enrollment)
// @route     GET /api/quizzes
// @access    Private
exports.getQuizzes = asyncHandler(async (req, res, next) => {
  let query;

  if (req.user.role === 'student') {
    // For students, find quizzes related to their enrolled courses
    const enrollments = await Enrollment.find({ user: req.user.id }).select('course');
    const courseIds = enrollments.map(enrollment => enrollment.course);
    query = Quiz.find({ course: { $in: courseIds } });
  } else if (req.user.role === 'instructor') {
    // For instructors, find quizzes for courses they teach
    const courses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = courses.map(course => course._id);
    query = Quiz.find({ course: { $in: courseIds } });
  } else if (req.user.role === 'admin') {
    // Admins can see all quizzes
    query = Quiz.find();
  } else {
    return next(new ErrorResponse('Not authorized to access quizzes', 403));
  }

  const quizzes = await query.populate({
    path: 'course',
    select: 'title',
  });

  // For students, we might want to also return their best score/attempts
  if (req.user.role === 'student') {
    const quizIds = quizzes.map(q => q._id);
    const attempts = await QuizAttempt.find({ quiz: { $in: quizIds }, student: req.user.id });
    const statsByQuiz = attempts.reduce((acc, a) => {
      const id = a.quiz.toString();
      if (!acc[id]) acc[id] = { attempts: 0, best: null };
      acc[id].attempts += 1;
      if (acc[id].best === null || a.percentageScore > acc[id].best) acc[id].best = a.percentageScore;
      return acc;
    }, {});
    const quizzesWithStudentData = quizzes.map((quiz) => {
      const s = statsByQuiz[quiz._id.toString()] || { attempts: 0, best: null };
      return {
        ...quiz.toJSON(),
        bestScore: s.best,
        attempts: s.attempts,
      };
    });
    return res.status(200).json({
      success: true,
      count: quizzesWithStudentData.length,
      data: quizzesWithStudentData,
    });
  }


  res.status(200).json({
    success: true,
    count: quizzes.length,
    data: quizzes,
  });
});

// @desc      Get a single quiz details
// @route     GET /api/quizzes/:id
// @access    Private
exports.getQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate({
    path: 'course',
    select: 'title',
  });

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
  }

  // Authorization: Student can view if enrolled, Instructor if they own course, Admin can view all
  if (req.user.role === 'student') {
    const enrollment = await Enrollment.findOne({ user: req.user.id, course: quiz.course });
    if (!enrollment) {
      return next(new ErrorResponse(`Not authorized to view this quiz`, 403));
    }
  } else if (req.user.role === 'instructor') {
    const course = await Course.findById(quiz.course);
    if (!course || course.instructor.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to view this quiz`, 403));
    }
  } // Admin has access by default due to authorize middleware

  // If the user is a student, remove correct answers from the questions before sending
  const quizData = quiz.toJSON();
  if (req.user.role === 'student') {
    quizData.questions = quizData.questions.map(q => {
      const { correctAnswerIndex, ...rest } = q; // Exclude correctAnswerIndex
      return rest;
    });
  }

  res.status(200).json({
    success: true,
    data: quizData,
  });
});

// Create quiz (Instructor only)
exports.createQuiz = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.courseId);
  if (!course) return next(new ErrorResponse('Course not found', 404));
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id)
    return next(new ErrorResponse('Not authorized', 403));
  const { title, description } = req.body;
  const quiz = await Quiz.create({ title, description, courseId: course.id, instructorId: course.instructorId });
  res.status(201).json({ success: true, quiz });
});

// Add question to quiz (Instructor only)
exports.addQuestion = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findByPk(req.params.quizId);
  if (!quiz) return next(new ErrorResponse('Quiz not found', 404));
  if (req.user.role !== 'admin' && quiz.instructorId !== req.user.id)
    return next(new ErrorResponse('Not authorized', 403));
  const { text, choices, correctOptionIndex } = req.body;
  const question = await Question.create({ quizId: quiz.id, text, correctOptionIndex });
  // Optionally, save choices if your model supports it
  res.status(201).json({ success: true, question });
});

// Student submits quiz attempt
exports.submitQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findByPk(req.params.quizId, { include: [{ model: Question, as: 'questions' }] });
  if (!quiz) return next(new ErrorResponse('Quiz not found', 404));
  // Check enrollment
  const enrollment = await Enrollment.findOne({ where: { userId: req.user.id, courseId: quiz.courseId } });
  if (!enrollment) return next(new ErrorResponse('Not enrolled in this course', 403));
  const { answers } = req.body; // [{ questionId, selectedOptionIndex }]
  let score = 0;
  let total = quiz.questions.length;
  for (const q of quiz.questions) {
    const userAnswer = answers.find(a => a.questionId === q.id);
    if (userAnswer && q.correctOptionIndex === userAnswer.selectedOptionIndex) {
      score++;
    }
  }
  const percentageScore = total > 0 ? (score / total) * 100 : 0;
  const attempt = await QuizAttempt.create({
    quizId: quiz.id, studentId: req.user.id, courseId: quiz.courseId,
    answers: JSON.stringify(answers), score, percentageScore, submittedAt: new Date()
  });
  res.status(201).json({ success: true, attempt, score, percentageScore });
});

// Instructor views quiz attempts
exports.getQuizAttempts = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findByPk(req.params.quizId);
  if (!quiz) return next(new ErrorResponse('Quiz not found', 404));
  if (req.user.role !== 'admin' && quiz.instructorId !== req.user.id)
    return next(new ErrorResponse('Not authorized', 403));
  const attempts = await QuizAttempt.findAll({ where: { quizId: quiz.id } });
  res.status(200).json({ success: true, count: attempts.length, attempts });
});

// @desc      Update quiz
// @route     PUT /api/quizzes/:id
// @access    Private/Instructor, Admin
exports.updateQuiz = asyncHandler(async (req, res, next) => {
  let quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
  }

  const course = await Course.findById(quiz.course);
  // Make sure user is course owner or admin
  if (!course || (course.instructor.toString() !== req.user.id && req.user.role !== 'admin')) {
    return next(new ErrorResponse(`Not authorized to update this quiz`, 403));
  }

  quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: quiz,
  });
});

// @desc      Delete quiz
// @route     DELETE /api/quizzes/:id
// @access    Private/Instructor, Admin
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
  }

  const course = await Course.findById(quiz.course);
  // Make sure user is course owner or admin
  if (!course || (course.instructor.toString() !== req.user.id && req.user.role !== 'admin')) {
    return next(new ErrorResponse(`Not authorized to delete this quiz`, 403));
  }

  await quiz.deleteOne(); // This could also trigger cascade delete for quiz attempts

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Start a quiz attempt
// @route     POST /api/quizzes/:id/start
// @access    Private/Student
exports.startQuizAttempt = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  const studentId = req.user.id;

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
  }

  // Check if student is enrolled in the course
  const enrollment = await Enrollment.findOne({ user: studentId, course: quiz.course });
  if (!enrollment) {
    return next(new ErrorResponse(`You are not enrolled in the course for this quiz`, 403));
  }

  // Check attempts
  const existingAttempts = await QuizAttempt.countDocuments({ quiz: quiz._id, student: studentId });
  if (existingAttempts >= quiz.maxAttempts) {
    return next(new ErrorResponse(`You have exceeded the maximum attempts for this quiz`, 400));
  }

  // Return quiz questions (without correct answers) to the student
  const quizQuestionsForStudent = quiz.questions.map(({ questionText, options, _id }) => ({
    _id, // Keep the _id for client-side tracking
    questionText,
    options,
  }));

  res.status(200).json({
    success: true,
    data: {
      quizId: quiz._id,
      title: quiz.title,
      timeLimit: quiz.timeLimit,
      questions: quizQuestionsForStudent,
      attemptNumber: existingAttempts + 1,
    },
  });
});

// @desc      Submit a quiz attempt
// @route     POST /api/quizzes/:id/submit
// @access    Private/Student
exports.submitQuizAttempt = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  const studentId = req.user.id;
  const { answers: submittedAnswers, attemptNumber } = req.body;

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
  }
  if (!submittedAnswers || !Array.isArray(submittedAnswers)) {
    return next(new ErrorResponse('Invalid answers format', 400));
  }

  // Check if student is enrolled in the course
  const enrollment = await Enrollment.findOne({ user: studentId, course: quiz.course });
  if (!enrollment) {
    return next(new ErrorResponse(`You are not enrolled in the course for this quiz`, 403));
  }

  // Check if the attemptNumber is valid (sequential, not exceeding maxAttempts)
  const existingAttemptsCount = await QuizAttempt.countDocuments({ quiz: quiz._id, student: studentId });
  if (attemptNumber !== existingAttemptsCount + 1 || attemptNumber > quiz.maxAttempts) {
    return next(new ErrorResponse('Invalid attempt number or maximum attempts exceeded', 400));
  }


  // Calculate score
  let score = 0;
  const detailedAnswers = submittedAnswers.map((submittedAns) => {
    const question = quiz.questions.id(submittedAns.questionId); // Find question by _id
    let isCorrect = false;
    if (question && question.correctAnswerIndex === submittedAns.selectedOptionIndex) {
      isCorrect = true;
      score++;
    }
    return {
      questionId: submittedAns.questionId,
      selectedOptionIndex: submittedAns.selectedOptionIndex,
      isCorrect: isCorrect,
    };
  });

  const totalQuestions = quiz.questions.length;
  const percentageScore = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  const newAnswer = await QuizAttempt.create({
    quiz: quiz._id,
    student: studentId,
    course: quiz.course,
    attemptNumber,
    answers: detailedAnswers,
    score: score,
    percentageScore: percentageScore,
  });

  // Update enrollment with quiz score reference
  await Enrollment.findOneAndUpdate(
    { user: studentId, course: quiz.course },
    { $push: { quizScores: { quizId: quiz._id, score: percentageScore, attemptedAt: Date.now() } } },
    { new: true, upsert: true }
  );

  // Notify student about quiz completion/grade
  await createNotification({
    user: studentId,
    type: 'grade', // Or 'quiz_completed'
    title: `Quiz Submitted: ${quiz.title}`,
    message: `You scored ${percentageScore.toFixed(2)}% on "${quiz.title}" in ${enrollment.course.title}.`,
    course: enrollment.course,
    relatedEntity: { id: newAnswer._id, type: 'QuizAttempt' }
  });

  res.status(200).json({
    success: true,
    message: 'Quiz submitted successfully',
    data: {
      score: score,
      totalQuestions: totalQuestions,
      percentageScore: percentageScore,
      attemptId: newAnswer._id,
    },
  });
});

// @desc      Get quiz results for an attempt
// @route     GET /api/quizzes/:id/results/:attemptId
// @access    Private/Student, Instructor, Admin
exports.getQuizResults = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  const attempt = await QuizAttempt.findById(req.params.attemptId);

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
  }
  if (!attempt) {
    return next(new ErrorResponse(`Quiz attempt not found with id ${req.params.attemptId}`, 404));
  }

  // Authorization: Student can view their own results, Instructor if they own course, Admin can view all
  if (req.user.role === 'student' && attempt.student.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to view these results`, 403));
  } else if (req.user.role === 'instructor') {
    const course = await Course.findById(quiz.course);
    if (!course || course.instructor.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to view these results`, 403));
    }
  }
  // Admin has access by default

  // Combine quiz questions with student's answers for detailed results view
  const results = quiz.questions.map((question) => {
    const studentAnswer = attempt.answers.find(ans => ans.questionId && ans.questionId.toString() === question._id.toString());
    return {
      questionText: question.questionText,
      options: question.options,
      correctAnswerIndex: question.correctAnswerIndex, // Include for grading/review purposes
      selectedOptionIndex: studentAnswer ? studentAnswer.selectedOptionIndex : null,
      isCorrect: studentAnswer ? studentAnswer.isCorrect : false,
    };
  });

  res.status(200).json({
    success: true,
    data: {
      quizTitle: quiz.title,
      studentName: req.user.name, // Or populate student name from 'attempt'
      score: attempt.score,
      percentageScore: attempt.percentageScore,
      totalQuestions: quiz.questions.length,
      submittedAt: attempt.submittedAt,
      results: results,
    },
  });
});