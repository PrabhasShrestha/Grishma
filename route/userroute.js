const router = require('express').Router();
const userController = require('../controller/testController');

router.post('/register', userController.createUsers);
router.post('/login', userController.loginUser);
// Removed unused routes (add back if needed)
module.exports = router;