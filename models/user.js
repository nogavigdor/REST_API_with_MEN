const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema({
    //name
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    //email
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    //password
    password: {
        type: String,
        required: true,
        min: 6,
        max:255
    },

    //date when created
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema);