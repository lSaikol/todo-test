const bcrypt = require('bcrypt');
const UserDTO = require('../DTOs/UserDTO');
const APIError = require("../error/APIError");
const UserModel = require("../models/UserModel");
const TokenService = require('./TokenService');

module.exports = new class UserService {

    /**
     * Серивис выполняет регистрацию пользователя в базе данных
     * 
     * @param {String} login Логин пользователя
     * @param {String} password Пароль пользователя
     * @returns {Object} Объект токенов и данные пользователя
     */
    async registration(login, password) {
        const candidate = await UserModel.findOne({ login });
        if (candidate) {
            throw APIError.badRequest('Этот пользователь уже зарегистрирован');
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await UserModel.create({ login, password: hashPassword });
        const userDTO = new UserDTO(user);
        const tokens = TokenService.generateTokens({...userDTO});
        await TokenService.saveToken(userDTO.id, tokens.refreshToken);

        return { ...tokens, user: userDTO };
    }

    /**
     * Серивис выполняет авторизацию пользователя
     * 
     * @param {String} login Логин пользователя
     * @param {String} password Пароль пользователя
     * @returns {Object} Объект токенов и данные пользователя
     */
    async login(login, password) {
        const user = await UserModel.findOne({ login });
        if (!user) {
            throw APIError.badRequest('Этот пользователь не зарегистрирован');
        }

        const comparedPassword = await bcrypt.compare(password, user.password);
        if (!comparedPassword) {
            throw APIError.badRequest('Неверный логин или пароль');
        }

        const userDTO = new UserDTO(user);
        const tokens = TokenService.generateTokens({ ...userDTO });
        await TokenService.saveToken(userDTO.id, tokens.refreshToken);

        return { ...tokens, user: userDTO };
    }

    /**
     * Серивис выполняет удаление пользователя из базы данных
     * 
     * @param {String} userID ID пользователя
     * @returns {Object} Объект удалённого пользователя
     */
    async delete(userID) {
        const user = await UserModel.findByIdAndDelete(userID);
        if (!user) {
            throw APIError.badRequest('Этот пользователь не зарегистрирован');
        }

        const userDTO = new UserDTO(user);

        return { user: userDTO };
    }

    /**
     * Серивис выполняющий обновление токенов пользователя
     * 
     * @param {String} refreshToken Токен обновления
     * @returns {Object} Объект новых токенов и данные пользователя
     */
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw APIError.unauthorized();
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenDB = await TokenService.getToken(refreshToken);

        if (!userData || !tokenDB) {
            throw APIError.unauthorized();
        }

        const user = await UserModel.findById(userData.id);
        const userDTO = new UserDTO(user);
        const tokens = TokenService.generateTokens({...userDTO});
        await TokenService.saveToken(userDTO.id, tokens.refreshToken);
        
        return { ...tokens, user: userDTO };
    }
}