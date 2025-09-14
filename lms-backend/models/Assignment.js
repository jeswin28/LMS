// lms-backend/models/Assignment.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Assignment = sequelize.define('Assignment', {
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
    type: DataTypes.TEXT,
    allowNull: false
  },
  instructions: {
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
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  maxPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    validate: {
      min: 1
    }
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2), // Percentage weight in course grade
    defaultValue: 10.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  type: {
    type: DataTypes.ENUM('assignment', 'project', 'essay', 'presentation', 'quiz'),
    defaultValue: 'assignment'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  allowLateSubmission: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  latePenalty: {
    type: DataTypes.DECIMAL(5, 2), // Percentage penalty per day
    defaultValue: 10.00
  },
  maxSubmissions: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  allowResubmission: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rubric: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isGroupAssignment: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  maxGroupSize: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  visibility: {
    type: DataTypes.ENUM('visible', 'hidden', 'scheduled'),
    defaultValue: 'visible'
  },
  visibleFrom: {
    type: DataTypes.DATE
  },
  visibleUntil: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'assignments',
  timestamps: true,
  indexes: [
    {
      fields: ['courseId']
    },
    {
      fields: ['instructorId']
    },
    {
      fields: ['dueDate']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Assignment;