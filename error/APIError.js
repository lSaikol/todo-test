module.exports = class APIError extends Error {
    constructor(status, message) {
        super();

        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        return new APIError(400, message);
    }

    static forbidden(message) {
        return new APIError(403, message);
    }

    static unauthorized(message="Неавторизованный доступ") {
        return new APIError(401, message);
    }

}