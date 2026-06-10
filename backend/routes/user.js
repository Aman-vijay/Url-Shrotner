const {CreateUser, LoginUser} = require('../controllers/user');
const { validate, registerSchema, loginSchema } = require('../utils/validation');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/register', validate(registerSchema), CreateUser);
userRouter.post('/login', validate(loginSchema), LoginUser);

module.exports = userRouter;