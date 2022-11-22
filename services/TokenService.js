const jwt = require('jsonwebtoken');
const TokenModel = require('../models/TokenModel');

module.exports = new class TokenService {

    /**
     * @typedef {Object} Tokens
     * @property {String} accessToken Токен доступа
     * @property {String} refreshToken Токен обновления токена доступа
     */

    /**
     * @typedef {Object} ResultRemoveTokens
     * @property {String} acknowledged Было ли удаление
     * @property {String} deletedCount Количество удалённых токенов
     */



    /**
     * Генерирует набор токенов
     * 
     * @param {Object} payload Полезная нагрузка в токенах
     * @returns {Tokens} Набор токенов
     */
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        }
    }


    /**
     * Сохраняет токен обновлния в базе данных
     * 
     * @param {String} userID Индентификатор пользователя
     * @param {String} refreshToken Токен обновления 
     * @returns Объект данных токена
     */
    async saveToken(userID, refreshToken) {
        const userToken = await TokenModel.findOne({ user: userID });
        if (userToken) {
            userToken.refreshToken = refreshToken;
            return await userToken.save();
        }
        const token = await TokenModel.create({ user: userID, refreshToken });
        return token;
    }

    /**
     * Удаляет токен из базы данных
     *  
     * @param {String} refreshToken Токен обновления
     * @returns {ResultRemoveTokens} Данные удалённого токена
     */
    async removeToken(refreshToken) {
        const token = await TokenModel.deleteOne({ refreshToken });
        return token;
    }

    /**
     * Удаляет все токены обновления из базы данных связанные с ID пользователя
     *  
     * @param {String} userID ID пользователя
     * @returns {Object} Результат удаления токенов
     */
     async removeTokensById(userID) {
        const tokens = await TokenModel.deleteMany({ user: userID });
        return tokens;
    }

    /**
     * Валидирует токен доступа 
     * 
     * @param {String} token Токен доступа
     * @returns {Object|null} Результат валидации
     */
    validateAccessToken(token) {
        try {
            const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return tokenData;
        } catch (error) {
            return null;
        }
    }

    /**
     * Валидирует токен обновления 
     * 
     * @param {String} token Токен обновления
     * @returns {Object|null} Результат валидации
     */
    validateRefreshToken(token) {
        try {
            const tokenData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            return tokenData;
        } catch (error) {
            return null;
        }
    }

    /**
     * Возвращает данные токена с базы данных
     * 
     * @param {String} refreshToken Токен обновления
     * @returns Данные токена
     */
    async getToken(refreshToken) {
        const token = TokenModel.findOne({ refreshToken });
        return token;
    }
}