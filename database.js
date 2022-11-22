const mongoose = require('mongoose');

/**
 * Выполняет подключение к базе данных
 * 
 * @param {String} url URL для подключения к базе MongoDB
 * @return {Promise<typeof import("mongoose")> | undefined}
 * 
 */
module.exports = async url => {
    try {
        return await mongoose.connect(url);
    } catch (error) {
        console.log(error);
    }
}