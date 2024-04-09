
// Import chai 
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const jwt = require('jsonwebtoken');

// Mock authentication function to generate token
const generateTokenForTest = (userData) => {
    // Generate token using a mock secret key (for testing purposes only)
    const token = jwt.sign(userData, 'mock_secret_key', { expiresIn: '1h' }); // Change the expiresIn as needed
    return token;
};

describe('First test collection', () => {

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

    it('add an invalid product to the database - with a missing inStock property', (done) => {
        let product = {
            name: 'red lamp',
            description: 'Tall lamp for living room',
            price: '80',
            categories: ['living room', 'lamp']
        };
        chai.request(server)
            .post('/api/products')
            .send(product)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    }
    
        );

    it('verify that we have 1 product in the database', (done) => {
        chai.request(server)
            .get('/api/products')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

    it('First test', () => {
        expect(1).to.equal(1);
    });
});
