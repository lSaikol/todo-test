const { Router } = require('express');
const userController = require('../controllers/UserController');
const AuthHandler = require('../middlewares/AuthHandler');
const userRouter = new Router();


userRouter.post('/login', userController.login);
userRouter.post('/register', userController.register);
userRouter.delete('/delete', AuthHandler, userController.delete);
userRouter.get('/refresh', userController.refreshToken);
userRouter.get('/logout', userController.logout);


module.exports = userRouter;