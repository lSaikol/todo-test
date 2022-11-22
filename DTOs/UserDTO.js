module.exports = class UserDTO {
    constructor(model) {
        this.id = model.id;
        this.login = model.login;
    }
}