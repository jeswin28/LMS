// lms-backend/models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  role: {
    type: DataTypes.ENUM('student', 'instructor', 'admin'),
    defaultValue: 'student',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending_approval', 'rejected_application'),
    defaultValue: 'active',
    allowNull: false
  },
  joinedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // Student specific fields
  coursesEnrolled: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  coursesCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  achievements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Instructor specific fields
  coursesCreated: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  studentsEnrolled: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Profile fields
  phone: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  bio: {
    type: DataTypes.TEXT
  },
  dateOfBirth: {
    type: DataTypes.DATE
  },
  linkedIn: {
    type: DataTypes.STRING
  },
  github: {
    type: DataTypes.STRING
  },
  website: {
    type: DataTypes.STRING
  },
  avatar: {
    type: DataTypes.STRING
  },
  profileVisibility: {
    type: DataTypes.ENUM('public', 'students', 'private'),
    defaultValue: 'public'
  },
  showProgress: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  showAchievements: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allowMessages: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpire: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this.id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;