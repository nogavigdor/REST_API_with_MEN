const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let productSchema = new Schema({
    //name
    name: {
        type: String,
        required: true
    },
    //description
    description: {
        type: String
       
    },
    //price
    price: {
        type: Number
        
    },
    //in stock
    inStock: {
        type: Boolean
      
    },
    categories: {
        type: [String] // Array of category names
    },
    image: {
        type: Buffer // Image data
    },
    imageType: {
        type: String // Image type
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('product', productSchema);