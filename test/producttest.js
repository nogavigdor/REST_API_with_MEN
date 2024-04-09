process.env.NODE_ENV = 'test';
//impoty the product model
const Product = require('../models/product');
// Import chai 
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
/*
before((done) => {
    Product.deleteMany({}, (err) => {});
    done();
}
);

after((done) => {
    Product.deleteMany({}, (err) => {});
    done();
}
);
*/
before(async () => {
    await Product.deleteMany({});
});

after(async () => {
    await Product.deleteMany({});
});


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

    it('First test', () => {
        expect(1).to.equal(1);
    });
});
