// lms-backend/models/Discussion.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Discussion = sequelize.define('Discussion', {
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
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'courses',
            key: 'id'
        }
    },
    authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'discussions',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('question', 'discussion', 'announcement', 'general'),
        defaultValue: 'discussion'
    },
    status: {
        type: DataTypes.ENUM('active', 'closed', 'pinned', 'archived'),
        defaultValue: 'active'
    },
    isPinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    replyCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    attachments: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    lastActivity: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'discussions',
    timestamps: true,
    indexes: [
        {
            fields: ['courseId']
        },
        {
            fields: ['authorId']
        },
        {
            fields: ['parentId']
        },
        {
            fields: ['type']
        },
        {
            fields: ['status']
        },
        {
            fields: ['isPinned']
        },
        {
            fields: ['lastActivity']
        }
    ]
});

module.exports = Discussion; 