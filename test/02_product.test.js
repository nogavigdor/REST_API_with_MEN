
    // Import chai 
    const chai = require('chai');
    const expect = chai.expect;
    const should = chai.should();
    const chaiHttp = require('chai-http');
    const server = require('../server');
    const fs = require('fs');
    const path = require('path');

    chai.use(chaiHttp);

    const jwt = require('jsonwebtoken');

    // Mock authentication function to generate token
    const generateTokenForTest = (userData) => {
        // Generate token using a mock secret key (for testing purposes only)
        const token = jwt.sign(userData, 'mock_secret_key', { expiresIn: '1h' }); // Change the expiresIn as needed
        return token;
    };

    describe('Product Management Tests', () => {

        //testing the welcome route
        it('test welcome API route', (done) => {
            chai.request(server)
                .get('/api/welcome')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Welcome to the MEN RESTful produscts (furnitures) API!');
                    done();
                });
        });

        it('verify that we have 0 products in the database', (done) => {
            chai.request(server)
                .get('/api/products')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    /*
        it('add a valid product to the database', (done) => {
            let product = {
                name: 'pink lamp',
                description: 'Descorated lamp for office use',
                price: 120,
                inStock: true,
                categories: ['office', 'lamp']
            };
            chai.request(server)
                .post('/api/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('name').eql(product.name);
                    res.body.should.have.property('description').eql(product.description);
                    res.body.should.have.property('price').eql(product.price);
                    res.body.should.have.property('inStock').eql(product.inStock);
                    res.body.should.have.property('categories').eql(product.categories);
                    done();
                });
        });
    */
        it('should register + login a user, create product and DELETE it from DB', async function() {
            this.timeout(10000); // Set timeout to 10 seconds for this test
        
            // Step 1: Register a user
            let user = {
                name: "Noga Vigdor",
                email: "noga.vigdor@gmail.com",
                password: "123456"
            }
            let res = await chai.request(server)
                .post('/api/user/register')
                .send(user);
        
            // Asserts
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.a('object');
            expect(res.body.error).to.be.equal(null);
        
            // Step 2: Login the user
            res = await chai.request(server)
                .post('/api/user/login')
                .send({
                    email: "noga.vigdor@gmail.com",
                    password: "123456"
                });
        
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;
        
            // Step 3: Create new product
            res = await chai.request(server)
                .post('/api/products')
                .set({ "auth-token": token })
                .set('Content-Type', 'multipart/form-data')
                .field('name', 'red lamp')
                .field('description', 'Tall lamp for living room')
                .field('price', 80)
                .field('inStock', true)
                .field('categories', ['living room', 'lamp'])
                .attach('image', fs.readFileSync(path.resolve(__dirname, 'test-image.jpg')), 'test-image.jpg');
        
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('name').eql('red lamp');
            expect(res.body).to.have.property('description').eql('Tall lamp for living room');
            expect(res.body).to.have.property('price').eql(80);
            expect(res.body).to.have.property('inStock').eql(true);
            expect(res.body).to.have.property('categories').eql(['living room', 'lamp']);
            expect(res.body).to.have.property('imageData');
            expect(res.body).to.have.property('imageType');
            expect(res.body).to.have.property('imageUrl');
        
            // Step 4: Delete the product
            res = await chai.request(server)
                .delete(`/api/products/${res.body._id}`)
                .set({ "auth-token": token });
        
            expect(res).to.have.status(200);
        });
    
        it('First test', () => {
            expect(1).to.equal(1);
        });
    });
