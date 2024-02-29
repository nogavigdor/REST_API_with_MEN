//import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

//swagger dependencies
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

//swagger setup
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

const swaggerJsdoc = require('swagger-jsdoc');
//Extended: https://swagger.io/specification/#infoObject
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Products (Furnitures) API',
            description: 'A simple API to manage products (furnitures) in a store',
            version: '1.0.0',
            contact: {
                name: 'Noga Vigdor, noga.vigdor@gmail.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:4000/api'
            },
            {
                url: 'https://rest-api-with-men.onrender.com'
            }   
        
        ]
    },
    apis: ['./routes/*.js', './server.js']
};

const swaggwerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));




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
app.use("/api/products", productRoutes);

//auht routes
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000;


//start up server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;