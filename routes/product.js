const router = require('express').Router();
const Product = require('../models/product');
const { verifyToken, productValidation } = require('../validation');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const path = require('path');
const fs = require('fs');


let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

//CRUD operations

// /api/products


// /api/products
//Read all products - get

    router.get('/', (req, res) => {
        
            Product.find()
                .then(data => { res.send(mapArray(data)); })
                .catch(err => { res.status(500).send({ message: err.message }); });
        });

// /api/products/instock
//Read all products in stock - get

router.get('/instock', (req, res)=>{

    Product.find({inStock:true})
    .then(data => {res.send(data);}  )
    .catch(err => {res.status(500).send({message:err.message}); });
});

// /api/products/:id
//Read specific product - get
router.get('/:id', (req, res)=>{

    Product.findById(req.params.id)
    .then(data => {res.send(mapData(data));}  )
    .catch(err => {res.status(500).send({message:err.message}); });
});

function mapArray(inputArray){
    let outputArray = inputArray.map(element => mapData(element));
    return outputArray;
}

function mapData(element){
   let outputObj = {
        //do some validation...
        id: element._id,
         name: element.name,
         description: element.description,
         price: element.price,
         inStock: element.inStock,
         categories: element.categories,
         image: element.image,
         imageType: element.imageType,
         createdAt: element.createdAt,
         updatedAt: element.updatedAt,
        //add uri (HATEOAS) for this resource
        uri: `http://localhost:4000/api/products/${element._id}`
    };

     // Convert buffer to base64-encoded string
     if (element.image) {
        outputObj.image = element.image.toString('base64');
        outputObj.imageType = element.imageType;
    }
    
    return outputObj;
   }
   


//Create product - post

router.post('/', verifyToken, upload.single('image'), (req, res) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    // Validate product data
     // Prepare the product data with file and form data

      // Parse categories as an array
      const categories = Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories];
     
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock,
        categories: categories.filter(Boolean), // Filter out any empty values
    };

    if (req.files && req.files.image) {
        const file = req.files.image;
        const filename = crypto.randomBytes(16).toString('hex') + path.extname(file.name);
    
        const writestream = gfs.createWriteStream({
          filename: filename,
          content_type: file.mimetype,
          mode: 'w',
          metadata: {
            originalname: file.name
          }
        });
    
        const readstream = fs.createReadStream(file.tempFilePath);
        readstream.pipe(writestream);
    
        writestream.on('close', (file) => {
          productData.imageId = file._id;
          productData.imageType = file.contentType;
    

    // Validate product data
    const { error } = productValidation(productData);
    if (error) return res.status(400).send(error.details[0].message);

    // Create a new product
    const product = new Product(productData);
    product.save()
      .then(data => res.status(201).send(data))
      .catch(err => res.status(500).send({ message: err.message }));
  });
} else {
  const { error } = productValidation(productData);
  if (error) return res.status(400).send(error.details[0].message);

  const product = new Product(productData);
  product.save()
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message }));
}
});

// /api/products/:id
//Update specific product - put
router.put('/:id', verifyToken, upload.single('image'), (req, res)=>{
    const id = req.params.id;

     // Prepare update object
     const updateData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock,
        categories: req.body.categories ? req.body.categories.split(',').map(item => item.trim()) : [],
        updatedAt: Date.now()
    };

    if (req.files && req.files.image) {
        const file = req.files.image;
        const filename = crypto.randomBytes(16).toString('hex') + path.extname(file.name);
    
        const writestream = gfs.createWriteStream({
          filename: filename,
          content_type: file.mimetype,
          mode: 'w',
          metadata: {
            originalname: file.name
          }
        });
    
        const readstream = fs.createReadStream(file.tempFilePath);
        readstream.pipe(writestream);
    
        writestream.on('close', (file) => {
          updateData.imageId = file._id;
          updateData.imageType = file.contentType;
    
          const { error } = productValidation(updateData);
          if (error) return res.status(400).send(error.details[0].message);
    
          Product.findByIdAndUpdate(id, updateData, { new: true })
            .then(updatedProduct => {
              if (!updatedProduct) {
                return res.status(404).send({ message: `Cannot update product with id ${id}. Maybe product was not found!` });
              }
              const productLink = `${req.protocol}://${req.get('host')}/api/products/${updatedProduct._id}`;
              res.send({ message: "Product was updated successfully.", data: updatedProduct, link: productLink });
            })
            .catch(err => res.status(500).send({ message: `Error updating product with id = ${id}` }));
        });
      } else {
        const { error } = productValidation(updateData);
        if (error) return res.status(400).send(error.details[0].message);
    
        Product.findByIdAndUpdate(id, updateData, { new: true })
          .then(updatedProduct => {
            if (!updatedProduct) {
              return res.status(404).send({ message: `Cannot update product with id ${id}. Maybe product was not found!` });
            }
            const productLink = `${req.protocol}://${req.get('host')}/api/products/${updatedProduct._id}`;
            res.send({ message: "Product was updated successfully.", data: updatedProduct, link: productLink });
          })
          .catch(err => res.status(500).send({ message: `Error updating product with id = ${id}` }));
      }
    });

// /api/products/:id
//Delete specific product - delete
router.delete('/:id', verifyToken, (req, res)=>{
    const id = req.params.id;
    Product.findByIdAndDelete(id)
    .then(data => {
        if(!data){
            res.status(404).send({message:`Cannot delete product with id number ${id}. Maybe product was not found!`});
        }
        else{
            res.send({message:"Product was deleted successfully."});
        }
        
    }  )
    .catch(err => {res.status(500).send({message:`Error deleting product with id = ${id}`}); });
});
module.exports = router;