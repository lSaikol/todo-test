const APIError = require('../error/APIError');
const { validationResult } = require('express-validator');

module.exports = function (err, req, res, next) {
    if (err instanceof APIError) {
        return res.status(err.status).json({
            message: err.message
        });
    } 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Ошибка валидации", errors: errors.array() });
    }
    
    console.log(err);
    return res.status(500).json({
        message: "Непредвиденная ошибка"
    });
};