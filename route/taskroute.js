// route/taskroute.js
const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');
const authGuard = require('../middleware/authguard'); // Default import

// Debug logs
console.log('taskController loaded:', taskController);
if (!taskController.createTask || typeof taskController.createTask !== 'function') {
    console.error('taskController.createTask is not a function:', taskController.createTask);
}
console.log('authGuard loaded:', authGuard);
if (!authGuard || typeof authGuard !== 'function') {
    console.error('authGuard is not a function:', authGuard);
}

// Task routes
router.post('/tasks', authGuard, taskController.createTask);
router.get('/tasks', authGuard, taskController.getAllTasks);
router.put('/tasks/:id', authGuard, taskController.updateTask);
router.delete('/tasks/:id', authGuard, taskController.deleteTask);
router.get('/tasks/:id', authGuard, taskController.getTask);

module.exports = router;