// lms-backend/models/Course.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
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
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  thumbnail: {
    type: DataTypes.STRING
  },
  videoUrl: {
    type: DataTypes.STRING
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 0
  },
  totalLessons: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  enrolledStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived', 'pending_approval', 'rejected'),
    defaultValue: 'draft'
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  requirements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  outcomes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  materials: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  certificateTemplate: {
    type: DataTypes.TEXT
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'courses',
  timestamps: true,
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    },
    {
      fields: ['instructorId']
    }
  ]
});

module.exports = Course;