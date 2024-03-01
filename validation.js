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
    const verifyToken = (req, res, next) => {
        const token = req.header('auth-token');
        if (!token) return res.status(401).json({ message: 'Access Denied' });

        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            res.status(400).json({ message: 'Invalid Token' });
        }
    };

    module.exports = { registerValidation, loginValidation, verifyToken };
