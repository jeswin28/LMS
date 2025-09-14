// lms-backend/models/Lesson.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lesson = sequelize.define('Lesson', {
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
  content: {
    type: DataTypes.TEXT
  },
  videoUrl: {
    type: DataTypes.STRING
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 0
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  materials: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  objectives: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  prerequisites: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  indexes: [
    {
      fields: ['courseId']
    },
    {
      fields: ['instructorId']
    },
    {
      fields: ['order']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Lesson;