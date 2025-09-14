// lms-backend/models/Enrollment.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
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
  status: {
    type: DataTypes.ENUM('active', 'completed', 'dropped', 'suspended'),
    defaultValue: 'active'
  },
  progress: {
    type: DataTypes.INTEGER, // Percentage (0-100)
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  completedLessons: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalLessons: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completionDate: {
    type: DataTypes.DATE
  },
  lastAccessed: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  certificateIssued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  certificateUrl: {
    type: DataTypes.STRING
  },
  grade: {
    type: DataTypes.DECIMAL(5, 2), // Allows for grades like 95.50
    validate: {
      min: 0,
      max: 100
    }
  },
  notes: {
    type: DataTypes.TEXT
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
    defaultValue: 'pending'
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  paymentDate: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'courseId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['completionDate']
    }
  ]
});

module.exports = Enrollment;