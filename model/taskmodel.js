const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');
const User = require('./usermodel');

const Task = sequelize.define(
    'Task',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        priority: {
            type: DataTypes.ENUM('Low', 'Medium', 'High'),
            defaultValue: 'Medium',
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('To-Do', 'In-Progress', 'Done'),
            defaultValue: 'To-Do',
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'tasks',
        timestamps: true,
    }
);

Task.belongsTo(User, { foreignKey: 'created_by' });

module.exports = Task;