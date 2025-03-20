const {CreateUser, LoginUser} = require('../controllers/user');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/register', CreateUser);
userRouter.post('/login', LoginUser);

module.exports = userRouter;