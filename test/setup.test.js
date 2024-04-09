process.env.NODE_ENV = 'test';
//impoty the product model
const Product = require('../models/product');
const User = require('../models/user');
/*
before((done) => {
    Product.deleteMany({}, (err) => {});
    User.deleteMany({}, (err) => {});
    done();
}
);

after((done) => {
    Product.deleteMany({}, (err) => {});
    User.deleteMany({}, (err) => {});
    done();
}
);
*/
before(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
});

after(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
});

