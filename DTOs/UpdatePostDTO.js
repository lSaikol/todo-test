module.exports = class PostClientDTO {

    // title;
    // description;
    // isFinished;

    constructor(model) {
        if (model.title) {
            /** @type {String} */
            this.title = model.title;
        }
        if (model.isFinished) {
            /** @type {Boolean} */
            this.isFinished = model.isFinished;
        }
        if (model.description) {
            /** @type {String} */
            this.description = model.description;
        }
    }
}