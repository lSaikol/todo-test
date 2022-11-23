const PostDTO = require('../DTOs/PostDTO');
const UpdatePostDTO = require('../DTOs/UpdatePostDTO');
const APIError = require('../error/APIError');
const PostModel = require('../models/PostModel');

module.exports = new class PostService {
    
    /**
     * Возвращает массив постов пользователя
     * 
     * @param {String} userID ID пользователя
     * @param {Number} _limit Лимит результатов
     * @param {Number} _page Страница результатов
     * @param {Object} filters Объект фильтров
     * @returns {Object[]} Массив постов
     */
    async getAllPosts(userID, _limit = 10, _page = 1, filters) {
        const { _isFinished } = filters;
        const offset = _page * _limit - _limit;
        
        let postsQuery = PostModel.find({ 
            user: userID
        });

        if (_isFinished === '1' && typeof _isFinished !== 'undefined')
            postsQuery.where({ isFinished: true });
        else if (_isFinished === '0' && typeof _isFinished !== 'undefined')
            postsQuery.where({ isFinished: false });

        if (_limit >= 0) postsQuery.skip(offset).limit(_limit) 

        let posts = await postsQuery.exec();

        const postsDTO = posts.map(post => ({...new PostDTO(post)}));
        return postsDTO;
    }

    /**
     * Возвращает данные поста
     * 
     * @param {String} userID ID пользователя
     * @param {String} postID ID поста
     * @returns {Object} Данные поста
     */
    async getOnePost(userID, postID) {
        const post = await PostModel.findOne({ user: userID, _id: postID });
        const postDTO = new PostDTO(post);
        return { ...postDTO };
    }

    /**
     * Удаляет пост пользователя
     * 
     * @param {String} userID ID пользователя
     * @param {String} postID ID поста
     * @returns {Object} Данные удалённого поста
     */
    async deletePost(userID, postID) {
        const post = await PostModel.findOneAndDelete({ user: userID, _id: postID });
        if (!post) {
            throw APIError.badRequest("Пост не найден");
        }
        const postDTO = new PostDTO(post);
        return { ...postDTO };
    }

    /**
     * Обновляет пост по указанным полям updateData
     * 
     * @param {String} userID ID пользователя
     * @param {String} postID ID поста
     * @param {Object} updateData Объект данных с обновлёнными полями
     * @returns {Object} Объект нового поста
     */
    async updatePost(userID, postID, updateData = {}) {
        const post = await PostModel.findOne({ user: userID, _id: postID });
        if (!post) {
            throw APIError.badRequest("Пост не найден");
        }

        const updatePostDTO = new UpdatePostDTO(updateData);
        Object.assign(post, updatePostDTO);
        await post.save()

        const postDTO = new PostDTO(post);
        return { ...postDTO };
    }

    /**
     * Создаёт новый пост в базе данных
     * 
     * @param {String} userID ID пользователя
     * @param {String} title Заголовок поста
     * @param {String} description Описание поста
     * @returns {Object} Объект созданного поста
     */
    async createPost(userID, title, description) {
        const post = await PostModel.create({ user: userID, title, description });
        const postDTO = new PostDTO(post);
        return { ...postDTO };
    }

}