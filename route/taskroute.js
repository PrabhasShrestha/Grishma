const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController'); // Corrected case
const { authenticateToken } = require('../controller/testController'); // Ensure this file exists

// Task routes
router.post('/api/tasks', authenticateToken, taskController.createTask);
router.get('/api/tasks', authenticateToken, taskController.getAllTasks);
router.put('/api/tasks/:id', authenticateToken, taskController.updateTask);
router.delete('/api/tasks/:id', authenticateToken, taskController.deleteTask);
router.get('/api/tasks/:id', authenticateToken, taskController.getTask);

module.exports = router;