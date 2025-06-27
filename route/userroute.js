const route = require('express').Router();

const userController = require('../controller/userController')

route.get('/register', userController.createUsers)
route.get('/login', userController.LoginUsers)
route.get('/password', userController.changepassword)
route.get('/View', userController.Viewprofile)

module.exports = route;