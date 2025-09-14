'use strict';

const { sequelize } = require('../config/db');

// Import all models
const User = require('./User');
const Course = require('./Course');
const Lesson = require('./Lesson');
const Enrollment = require('./Enrollment');
const Assignment = require('./Assignment');
const Submission = require('./Submission');
const Quiz = require('./Quiz');
const Question = require('./Question');
const Discussion = require('./Discussion');
const Notification = require('./Notification');

// Define associations

// User associations
User.hasMany(Course, { foreignKey: 'instructorId', as: 'courses' });
User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' });
User.hasMany(Assignment, { foreignKey: 'instructorId', as: 'assignments' });
User.hasMany(Quiz, { foreignKey: 'instructorId', as: 'quizzes' });
User.hasMany(Lesson, { foreignKey: 'instructorId', as: 'lessons' });
User.hasMany(Discussion, { foreignKey: 'authorId', as: 'discussions' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// Course associations
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'courseLessons' });
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Course.hasMany(Assignment, { foreignKey: 'courseId', as: 'assignments' });
Course.hasMany(Quiz, { foreignKey: 'courseId', as: 'quizzes' });
Course.hasMany(Discussion, { foreignKey: 'courseId', as: 'discussions' });

// Lesson associations
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Lesson.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

// Enrollment associations
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Assignment associations
Assignment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Assignment.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });
Assignment.hasMany(Submission, { foreignKey: 'assignmentId', as: 'submissions' });

// Submission associations
Submission.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
Submission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Submission.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Submission.belongsTo(User, { foreignKey: 'gradedBy', as: 'grader' });

// Quiz associations
Quiz.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Quiz.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });
Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'questions' });

// Question associations
Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

// Discussion associations
Discussion.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Discussion.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Discussion.belongsTo(Discussion, { foreignKey: 'parentId', as: 'parent' });
Discussion.hasMany(Discussion, { foreignKey: 'parentId', as: 'replies' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Course,
  Lesson,
  Enrollment,
  Assignment,
  Submission,
  Quiz,
  Question,
  Discussion,
  Notification
};
