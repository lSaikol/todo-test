module.exports = class PostDTO {
    constructor(model) {
        this.id = model.id;
        this.title = model.title;
        this.userID = model.user;
        this.isFinished = model.isFinished;
        this.description = model.description;
    }
}