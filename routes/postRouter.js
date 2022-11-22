const postController = require('../controllers/PostController');
const { Router } = require('express');
const postRouter = new Router();


postRouter.post('/', postController.create);
postRouter.get('/', postController.getAllPosts);
postRouter.delete('/', postController.delete);
postRouter.put('/', postController.update);


module.exports = postRouter