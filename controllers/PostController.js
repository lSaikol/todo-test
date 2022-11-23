const PostService = require("../services/PostService");

module.exports = new class PostController {

    async getAllPosts(req, res, next) {
        try {
            const { id } = req.user;
            const { _limit, _page, _isFinished } = req.query;
            const filters = {
                _isFinished
            }

            const posts = await PostService.getAllPosts(id, Number(_limit), Number(_page), filters);
            res.json(posts);
        } catch (error) {
            next(error);
        }
    }

    async getOnePost(req, res, next) {
        try {
            const userID = req.user.id;
            const postID = req.params.id;

            const post = await PostService.getOnePost(userID, postID);
            res.json(post);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const userID = req.user.id;
            const postID = req.params.id;

            const postData = await PostService.deletePost(userID, postID);
            res.json(postData);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { id } = req.user;
            const { title, description } = req.body;

            const postData = await PostService.createPost(id, title, description);
            res.json(postData);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const userID = req.user.id;
            const postID = req.params.id;
            const query = req.body;

            const postData = await PostService.updatePost(userID, postID, query);
            res.json(postData);
        } catch (error) {
            next(error);
        }
    }

}