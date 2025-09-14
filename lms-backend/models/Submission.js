// lms-backend/models/Submission.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  assignmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'assignments',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  submissionText: {
    type: DataTypes.TEXT
  },
  fileName: {
    type: DataTypes.STRING
  },
  filePath: {
    type: DataTypes.STRING
  },
  fileSize: {
    type: DataTypes.INTEGER
  },
  mimeType: {
    type: DataTypes.STRING
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  grade: {
    type: DataTypes.DECIMAL(5, 2),
    validate: {
      min: 0,
      max: 100
    }
  },
  feedback: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'graded', 'returned', 'late'),
    defaultValue: 'pending'
  },
  gradedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  gradedAt: {
    type: DataTypes.DATE
  },
  isLate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  latePenalty: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  finalGrade: {
    type: DataTypes.DECIMAL(5, 2)
  },
  attemptNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'submissions',
  timestamps: true,
  indexes: [
    {
      fields: ['assignmentId']
    },
    {
      fields: ['studentId']
    },
    {
      fields: ['courseId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['submittedAt']
    }
  ]
});

module.exports = Submission;