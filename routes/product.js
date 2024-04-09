const router = require('express').Router();
const Product = require('../models/product');
const { verifyToken, productValidation } = require('../validation');

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
      //   description: element.description,
        //nStock: element.inStock
        //add uri (HATEOAS) for this resource
        uri: `http://localhost:4000/api/products/${element._id}`
    };

    return outputObj;
   }
   


//Create product - post

//router.post('/', verifyToken, (req, res) => {
router.post('/', (req, res) => {ru
    // Validate product data
    const { error } = productValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create a new product
    const product = new Product(req.body);
    Product.save()
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message }));
});

// /api/products/:id
//Update specific product - put
router.put('/:id', verifyToken, (req, res)=>{
    const id = req.params.id;

    // Validate product data
    const { error } = productValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update the product
    Product.findByIdAndUpdate(id, req.body, { new: true }) // Use { new: true } to return the updated document
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).send({ message: `Cannot update product with id number ${id}. Maybe product was not found!` });
            }

            // Construct the product link based on the base URL
            const productLink = `${req.protocol}://${req.get('host')}/api/products/${updatedProduct._id}`;

        // Send back the updated product data and its link
            res.send({ message: "Product was updated successfully.", data: updatedProduct, link: productLink }); 
        })
        .catch(err => res.status(500).send({ message: `Error updating product with id = ${id}` }));
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