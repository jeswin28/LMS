// lms-backend/models/Question.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    quizId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'quizzes',
            key: 'id'
        }
    },
    questionText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    questionType: {
        type: DataTypes.ENUM('multiple_choice', 'true_false', 'short_answer', 'essay', 'matching'),
        defaultValue: 'multiple_choice'
    },
    options: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    correctAnswer: {
        type: DataTypes.JSON, // Can be string, array, or object depending on question type
        allowNull: false
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    explanation: {
        type: DataTypes.TEXT
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isRequired: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        defaultValue: 'medium'
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    timeLimit: {
        type: DataTypes.INTEGER, // in seconds
        defaultValue: 0 // 0 means no time limit
    },
    allowPartialCredit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    shuffleOptions: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'questions',
    timestamps: true,
    indexes: [
        {
            fields: ['quizId']
        },
        {
            fields: ['order']
        },
        {
            fields: ['difficulty']
        }
    ]
});

module.exports = Question;
