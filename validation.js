const Joi = require('joi');
const jwt = require('jsonwebtoken');

//validating registration
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).max(255).required(),
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required()
    });
    return schema.validate(data);
};

//validating login
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required()
    });
    return schema.validate(data);
};

//logic to verify the token (JWT)
const verifyToken = (token) => {
    // Add your logic to verify the token here
};

module.exports = { registerValidation, loginValidation, verifyToken };
