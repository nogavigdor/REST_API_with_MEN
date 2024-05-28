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
    imageData: {
        type: Buffer // Binary data of the image
    },
    imageType: {
        type: String // MIME type of the image
    },
    imageUrl: {
        
        type: String // URL of the image
        
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