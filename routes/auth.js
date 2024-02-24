const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {registerValidation, loginValidation} = require('../validation');
const { application } = require('express');

//Registration
router.post('/register', async (req, res)=>{

    //validate the user input (name, email, password)
    const {error} = registerValidation(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    //check if the email already registered 
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist){
        return res.status(400).json({message:"Email already exists"});
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //create a new user and save in the database
    const userObject = new User({
        name:req.body.name,
        email:req.body.email,
        password:password
    });

    try{
        const savedUser = await userObject.save();
        res.status(200).json({error:null, user:savedUser._id});
    }catch(error){
        return res.status(400).json({message:error});
    }
});


//Login
router.post('/login', async (req, res)=>{
    //validate the user login input (email, password)
    const {error} = loginValidation(req.body);

    //if the input is not valid, return an error
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    const user = await User.findOne({email:req.body.email});

    //if the email is not found, return an error
    if(!user){
        return res.status(400).json({message:"Email is not found"});
    }

    //if user exists, check if the password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);

    //if the password is not valid, return an error
    if(!validPass){
        return res.status(400).json({message:"Invalid password"});
    }

    //create authentication token with username and id
    const token = jwt.sign
    (
        //payload
        {
            name:user.name,
            id:user._id
        },
        //TOKEN_SECRET
        process.env.TOKEN_SECRET,
        //EXPIRATION TIME
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    //attach auth token to header
    res.header('auth-token', token).json({
        error: null,
        data: { token }
    });

});

module.exports = router;