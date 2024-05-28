const router = require('express').Router();
const Product = require('../models/product');
const { verifyToken, productValidation } = require('../validation');
const mongoose = require('mongoose');
const multer = require('multer');

// Multer storage setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

//CRUD operations

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

function mapData(element) {
  let outputObj = {
      id: element._id,
      name: element.name,
      description: element.description,
      price: element.price,
      inStock: element.inStock,
      categories: element.categories,
      imageUrl: `http://localhost:4000/api/products/image/${element._id}`, // Direct construction
      createdAt: element.createdAt,
      updatedAt: element.updatedAt,
      uri: `http://localhost:4000/api/products/${element._id}`
  };
  if (element.imageData) {
      // Optional: Convert to base64 if needed for direct display on frontend
      outputObj.imageData = element.imageData.toString('base64');
      outputObj.imageType = element.imageType;
  }
  return outputObj;
}
   


//Create product - post

router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    // Validate product data
     // Prepare the product data with file and form data

      // Extract categories and handle them properly
    const categories = req.body.categories ? req.body.categories.split(',').map(item => item.trim()) : [];

      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock,
        categories: categories,
        imageData: req.file ? req.file.buffer : undefined,
        imageType: req.file ? req.file.mimetype : undefined,
        imageUrl: req.file ? `http://localhost:4000/api/products/image/${req.file.originalname}` : null
    };

    const { error } = productValidation(productData);
    if (error) return res.status(400).send(error.details[0].message);

    const product = new Product(productData);
    try {
        const savedProduct = await product.save();
        // Update the imageUrl with the product id
        savedProduct.imageUrl = `http://localhost:4000/api/products/image/${savedProduct._id}`;
        await savedProduct.save();
        res.status(201).send(savedProduct);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// /api/products/:id/image
// Serve image - get
router.get('/image/:id', (req, res) => {
  Product.findById(req.params.id)
      .then(product => {
          if (!product || !product.imageData) {
              return res.status(404).send('Image not found.');
          }
          res.contentType(product.imageType);
          res.send(product.imageData);
      })
      .catch(err => res.status(500).send({ message: err.message }));
});

// /api/products/:id
//Update specific product - put
router.put('/:id', verifyToken,upload.single('image'), async (req, res)=>{
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

    // Check if there is a file
    if (req.file) {
      updateData.imageData = req.file.buffer;
      updateData.imageType = req.file.mimetype;
  }

          const { error } = productValidation(updateData);
          if (error) return res.status(400).send(error.details[0].message);

          try {
            const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedProduct) {
                return res.status(404).send({ message: `Cannot update product with id ${id}. Maybe product was not found!` });
            }
            updatedProduct.imageUrl = `http://localhost:4000/api/products/image/${updatedProduct._id}`;
            await updatedProduct.save();
            const productLink = `${req.protocol}://${req.get('host')}/api/products/${updatedProduct._id}`;
            res.send({ message: "Product was updated successfully.", data: updatedProduct, link: productLink });
        } catch (err) {
            res.status(500).send({ message: `Error updating product with id = ${id}` });
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