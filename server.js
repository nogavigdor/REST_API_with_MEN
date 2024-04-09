//import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

//swagger dependencies
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const cors = require('cors');

//require.dotenv-flow.config();

//CORS npm package
/*
app.use(cors({
 "origin":"http://localhost:5501"   
}));
*/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
//swagger setup
const swaggerDefinition = yaml.load('./swagger.yaml');
//app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));


const swaggerJsdoc = require('swagger-jsdoc');
//Extended: https://swagger.io/specification/#infoObject
// Define dynamic Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Products (Furnitures) API',
            description: 'A simple API to manage products (furnitures) in a store',
            version: '1.0.0',
            contact: {
                name: 'Noga Vigdor',
                email: 'noga.vigdor@gmail.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:4000/api'
            },
            {
                url: 'https://rest-api-with-men.onrender.com/api'
            }   
        ],
        // Merge the static definition with the dynamic options
        ...swaggerDefinition
    },
    apis: ['./routes/*.js', './server.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));




//import product routes
const productRoutes = require('./routes/product');

//import auth routes
const authRoutes = require('./routes/auth');

require('dotenv-flow').config();

//parse request of content-type json
app.use(bodyParser.json());


//routes
app.get('/api/welcome', (req, res) => {
    res.status(200).send({message:"Welcome to the MEN RESTful produscts (furnitures) API!"});
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