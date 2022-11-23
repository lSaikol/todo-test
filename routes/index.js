const Router = require('express');
const apiRouter = new Router();

const userRouter = require('./userRouter');
const postRouter = require('./postRouter');

apiRouter.use('/posts', postRouter);
apiRouter.use('/user', userRouter);


module.exports = apiRouter;