    const Joi = require('joi');
    const jwt = require('jsonwebtoken');

    const productValidation = (data) => {
        const schema = Joi.object({
            name: Joi.string().required().max(255), // Maximum 255 characters for name
            description: Joi.string().allow('').max(1000), // Maximum 1000 characters for description
            price: Joi.number().required().min(0),
            inStock: Joi.boolean().required(),
            categories: Joi.array().items(
                Joi.string().required().max(50) // Maximum 50 characters for each category
            ).max(10), // Maximum 10 categories allowed
            imageId: Joi.any().optional(), // optional imageId
            imageType: Joi.string().optional(), // optional imageType
            updatedAt: Joi.date().optional(), // Allow date for updatedAt
        });
        return schema.validate(data);
    };
    
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

    module.exports = { registerValidation, loginValidation, verifyToken, productValidation };
