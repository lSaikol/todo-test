const APIError = require('../error/APIError');
const TokenService = require('../services/TokenService');
const UserService = require('../services/UserService');


module.exports = new class UserController {

    async login(req, res, next) {
        try {
            const { login, password } = req.query;
            if (!login || !password) {
                return next(APIError.badRequest('Не указан пароль или пароль'));
            }

            const userData = await UserService.login(login, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true })
            res.json(userData);
            
        } catch (error) {
            next(error);   
        }
    }

    async register(req, res, next) {
        try {
            const { login, password } = req.query;
            if (!login || !password) {
                return next(APIError.badRequest('Не указан пароль или пароль'));
            }
            
            const userData = await UserService.registration(login, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true })
            res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.user;
            
            await UserService.delete(id);
            await TokenService.removeTokensById(id);
            return res.json({ message: "Пользователь удалён" });
        } catch (error) {
            next(error);
        }

    }

    async logout(req, res) {
        try {
            const {refreshToken} = req.cookies;
            await TokenService.removeToken(refreshToken);
            res.clearCookie('refreshToken');
            res.json({ message: "Аккаунт отключён" });
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true })
            res.json(userData);
        } catch (error) {
            next(error);
        }
    }

}