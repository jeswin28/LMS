// lms-backend/models/Quiz.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  maxPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    validate: {
      min: 1
    }
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 70,
    validate: {
      min: 0,
      max: 100
    }
  },
  timeLimit: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 0 // 0 means no time limit
  },
  attemptsAllowed: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  isRandomized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  showResults: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  showCorrectAnswers: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allowReview: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
  },
  instructions: {
    type: DataTypes.TEXT
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2), // Percentage weight in course grade
    defaultValue: 10.00,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'quizzes',
  timestamps: true,
  indexes: [
    {
      fields: ['courseId']
    },
    {
      fields: ['instructorId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['startDate']
    },
    {
      fields: ['endDate']
    }
  ]
});

module.exports = Quiz;