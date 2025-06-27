const Task = require('../model/taskmodel');
const User = require('../model/usermodel');

// Create Task
const createTask = async (req, res) => {
    try {
        const { title, description, priority, due_date } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.json({ success: false, message: "title is required" });
        }

        const newTask = await Task.create({
            title,
            description,
            priority: priority || 'Medium',
            due_date,
            status: 'To-Do',
            created_by: userId,
            assigned_to: userId
        });

        res.status(201).json({ success: true, message: "task created", task: newTask });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const tasks = await Task.findAll({
            where: { created_by: userId },
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ error: "error fetching tasks" });
    }
};

// Update Task
const updateTask = async (req, res) => {
    const taskId = req.params.id;
    try {
        const userId = req.user.id;
        const { title, description, priority, status, due_date } = req.body;

        const task = await Task.findOne({ where: { id: taskId, created_by: userId } });
        if (!task) {
            return res.json({ success: false, message: "task not found" });
        }

        await Task.update(
            { title, description, priority, status, due_date },
            { where: { id: taskId } }
        );

        res.json({ success: true, message: "task updated" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    const taskId = req.params.id;
    try {
        const userId = req.user.id;

        const task = await Task.findOne({ where: { id: taskId, created_by: userId } });
        if (!task) {
            return res.json({ success: false, message: "task not found" });
        }

        await Task.destroy({ where: { id: taskId } });
        res.json({ success: true, message: "task deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Single Task
const getTask = async (req, res) => {
    const taskId = req.params.id;
    try {
        const userId = req.user.id;

        const task = await Task.findOne({ where: { id: taskId, created_by: userId } });
        if (!task) {
            return res.json({ success: false, message: "task not found" });
        }

        res.json({ success: true, task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTask
};