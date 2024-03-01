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
    }
});

module.exports = mongoose.model('product', productSchema);