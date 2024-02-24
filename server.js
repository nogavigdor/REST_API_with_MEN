const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const { verifyToken } = require('./validation');

//import product routes
const productRoutes = require('./routes/product');
//import auth routes
const authRoutes = require('./routes/auth');

require('dotenv-flow').config();

//parse request of content-type json
app.use(bodyParser.json());


//routes
app.get('/api/welcome', (req, res) => {
    res.status(200).send({message:"Welcome to the MEN RESTful API"});
});


//connect to mongodb
mongoose.connect(
    process.env.DBHOST,
    {
        //useNewUrlParser: true,
        //useUnifiedTopology: true
    }
    ).catch(error=>console.log('Error connecting to mongoDB:'+error));

mongoose.connection.once('open', () => console.log('Connected successfuly to MongoDB'));

//post, put, delete -> CRUD
app.use("/api/products", verifyToken, productRoutes);

//auht routes
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000;


//start up server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;