// lms-backend/models/Notification.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'course_update', 'assignment_due', 'grade_released', 'discussion_reply', 'system'),
    defaultValue: 'info'
  },
  category: {
    type: DataTypes.ENUM('course', 'assignment', 'discussion', 'grade', 'system', 'general'),
    defaultValue: 'general'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isEmailSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPushSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  actionUrl: {
    type: DataTypes.STRING
  },
  actionText: {
    type: DataTypes.STRING
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  scheduledFor: {
    type: DataTypes.DATE
  },
  expiresAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['isRead']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['scheduledFor']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

module.exports = Notification;