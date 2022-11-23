const postController = require('../controllers/PostController');
const AuthHandler = require('../middlewares/AuthHandler');
const { Router } = require('express');
const postRouter = new Router();


postRouter.post('/', AuthHandler, postController.create);
postRouter.get('/', AuthHandler, postController.getAllPosts);
postRouter.get('/:id', AuthHandler, postController.getOnePost);
postRouter.delete('/:id', AuthHandler, postController.delete);
postRouter.put('/:id', AuthHandler, postController.update);


module.exports = postRouter;