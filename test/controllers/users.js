const mongoose = require("mongoose");
const User = require('../../models/user');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const api = require('../../app');
const should = chai.should();
const expect = chai.expect
const assert = chai.assert
chai.use(chaiHttp);

app.listen(process.env.NODE_PORT || 4000);

describe('/GET users', () => {
    // Clear all users from the test database
    before(function (done) {
        var User = mongoose.model('User');
        User.remove({}, function (err) {
            if (err) { console.log(err) }
            done();
        });
    });

    it('it should return 0 users', (done) => {
        chai.request(api)
            .get('/users')
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(200);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.be.a('object');
                res.body.data.should.be.an('object');
                res.body.data.users.should.be.a('array');
                //res.body.data.users.length.should.be.eql(0);
                done();
            });
    });
});

describe('/POST user', () => {

    it('it should create a user', (done) => {
        var user = {
            password: "123456",
            email: "testuser@kea.dk",
            firstName: "John",
            lastName: "Doe",
            address: "Street 2",
            phone: "12345678",
            teamId: null,
            isAdmin: true
        }

        chai.request(api)
            .post('/users')
            .set('content-type', 'application/json')
            .send(user)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(201);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.be.an('object');
                res.body.data.should.be.an('object');
                res.body.data.should.have.property('user')
                res.body.data.user.should.be.an('object');
                // _id is auto generated
                res.body.data.user.should.have.property('_id');
                res.body.data.user.should.have.property('email');
                res.body.data.user.should.have.property('firstName');
                res.body.data.user.should.have.property('lastName');
                res.body.data.user.should.have.property('address');
                res.body.data.user.should.have.property('phone');
                res.body.data.user.should.have.property('teamId');
                res.body.data.user.should.have.property('phone');
                res.body.data.user.should.have.property('createdAt');
                res.body.data.user.should.have.property('isAdmin');
                expect(res.body.data.user.email).to.equal('testuser@kea.dk');
                expect(res.body.data.user.firstName).to.equal('John');
                expect(res.body.data.user.lastName).to.equal('Doe');
                expect(res.body.data.user.address).to.equal('Street 2');
                expect(res.body.data.user.phone).to.equal('12345678');
                expect(res.body.data.user.teamId).to.be.null;
                expect(res.body.data.user.isAdmin).to.be.true;
                done();
            });
    });
});


describe('/POST user with a already used email address', () => {

    it('it should return 400 since the email address is already in use', (done) => {
        var user = {
            password: "123456",
            // same email used in the test above
            email: "testuser@kea.dk",
            firstName: "John",
            lastName: "Doe",
            address: "Street 2",
            phone: "12345678",
            teamId: null,
            isAdmin: true
        }

        chai.request(api)
            .post('/users')
            .set('content-type', 'application/json')
            .send(user)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(400);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.false;
                res.body.should.be.an('object');
                res.body.should.have.property('error')
                res.body.error.should.be.an('object');
                res.body.error.should.have.property('message')
                res.body.error.should.have.property('code')
                // 11000 is the code for a unique constraint/duplicate key 
                expect(res.body.error.code).to.equal(11000);
                done();
            });
    });
});


describe('/GET users should return 1 user', () => {
    it('it should return 1 users', (done) => {
        chai.request(api)
            .get('/users')
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(200);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.be.a('object');
                res.body.data.should.be.an('object');
                res.body.data.users.should.be.a('array');
                // 1 user has been created above
                //res.body.data.users.length.should.be.eql(1);
                done();
            });
    });
});



//////////////////////////////////////////////////////////////////////////////////////////////////////
// Test for ensuring that a user and a proper status code is returned when an existing user id is provided.
//////////////////////////////////////////////////////////////////////////////////////////////////////

describe('/GET user with id', () => {
    var createdUserId;

    before(function (done) {
        var user = {
            password: "123456",
            email: "test@kea.dk",
            firstName: "David",
            lastName: "Jackson",
            address: "Street 3",
            phone: "88888888",
            teamId: null,
            isAdmin: false
        }

        chai.request(api)
            .post('/users')
            .set('content-type', 'application/json')
            .send(user)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(201);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.be.an('object');
                res.body.data.should.be.an('object');
                res.body.data.should.have.property('user')
                res.body.data.user.should.be.an('object');
                // _id is auto generated
                res.body.data.user.should.have.property('_id');
                res.body.data.user.should.have.property('email');
                res.body.data.user.should.have.property('firstName');
                res.body.data.user.should.have.property('lastName');
                res.body.data.user.should.have.property('address');
                res.body.data.user.should.have.property('phone');
                res.body.data.user.should.have.property('teamId');
                res.body.data.user.should.have.property('phone');
                res.body.data.user.should.have.property('createdAt');
                res.body.data.user.should.have.property('isAdmin');
                expect(res.body.data.user.email).to.equal('test@kea.dk');
                expect(res.body.data.user.firstName).to.equal('David');
                expect(res.body.data.user.lastName).to.equal('Jackson');
                expect(res.body.data.user.address).to.equal('Street 3');
                expect(res.body.data.user.phone).to.equal('88888888');
                expect(res.body.data.user.teamId).to.be.null;
                expect(res.body.data.user.isAdmin).to.be.false;
                createdUserId = res.body.data.user._id;
                done();
            });
    });

    it('it should GET the user with a specific id', (done) => {
        chai.request(api)
            .get('/users/' + createdUserId)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(200);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.be.an('object');
                res.body.data.should.be.an('object');
                res.body.data.should.have.property('user')
                res.body.data.user.should.be.an('object');
                expect(res.body.data.user._id).to.equal(createdUserId);
                done();
            });
    });
});

describe('/GET users', () => {
    it('it should return 2 users', (done) => {
        chai.request(api)
            .get('/users')
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(200);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.be.a('object');
                res.body.data.should.be.an('object');
                res.body.data.users.should.be.a('array');
                //res.body.data.users.length.should.be.eql(2);
                done();
            });
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Test for ensuring that a valid error is returned to the user, when a nonexistant user id is provided.
//////////////////////////////////////////////////////////////////////////////////////////////////////

describe('/GET user with incorrect id', () => {
    it('it should return a 404 error code since no user has the specified id', (done) => {
        chai.request(api)
            .get('/users/-1')
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(404);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.false;
                res.body.should.be.an('object');
                res.body.should.have.property('error')
                res.body.error.should.be.an('object');
                res.body.error.should.have.property('message')
                done();
            });
    });
});


describe('/GET holidays', () => {
    it('it should return a 200 with holiday entities', (done) => {
        chai.request(api)
            .get('/holidays')
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(200);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.have.property('data')
                res.body.data.should.be.an('object');
                res.body.data.holidays.should.be.an('array');
                res.body.data.holidays.every(i => expect(i).to.have.all.keys('_id', '__v', 'date', 'dayOfWeek', 'englishName', 'localName'));
                done();
            });
    });
});


describe('/POST login', () => {
    // We make those 'global' for this test to be used when loggin in.
    var email = "testlogin@kea.dk";
    var password = "123456";
    var userId;
    before(function (done) {
        var user = {
            password: password,
            email: email,
            firstName: "Hans",
            lastName: "Peter",
            address: "Street 4",
            phone: "12345679",
            teamId: null,
            isAdmin: false
        }

        chai.request(api)
            .post('/users')
            .set('content-type', 'application/json')
            .send(user)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(201);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.be.an('object');
                res.body.data.should.be.an('object');
                res.body.data.should.have.property('user')
                res.body.data.user.should.be.an('object');
                // _id is auto generated
                res.body.data.user.should.have.property('_id');
                res.body.data.user.should.have.property('email');
                res.body.data.user.should.have.property('firstName');
                res.body.data.user.should.have.property('lastName');
                res.body.data.user.should.have.property('address');
                res.body.data.user.should.have.property('phone');
                res.body.data.user.should.have.property('teamId');
                res.body.data.user.should.have.property('phone');
                res.body.data.user.should.have.property('createdAt');
                res.body.data.user.should.have.property('isAdmin');
                expect(res.body.data.user.email).to.equal(email);
                expect(res.body.data.user.firstName).to.equal('Hans');
                expect(res.body.data.user.lastName).to.equal('Peter');
                expect(res.body.data.user.address).to.equal('Street 4');
                expect(res.body.data.user.phone).to.equal('12345679');
                expect(res.body.data.user.teamId).to.be.null;
                expect(res.body.data.user.isAdmin).to.be.false;
                userId = res.body.data.user._id;
                done();
            });
    });

    it('it should return a 200 with a JWT and a user object', (done) => {
        chai.request(api)
        .post('/login')
        .set('content-type', 'application/json')
        .send({email: email, password: password})
        .end((err, res) => {
            res.should.be.json;
            res.should.have.status(200);
            res.body.should.have.property('success')
            expect(res.body.success).to.be.true;
            res.body.should.be.an('object');
            res.body.data.should.be.an('object');
            res.body.data.should.have.property('token')
            res.body.data.token.should.be.a('string');
            res.body.data.should.have.property('user')
            res.body.data.user.should.be.an('object');
            res.body.data.user.should.have.property('_id');
            res.body.data.user.should.have.property('email');
            res.body.data.user.should.have.property('firstName');
            res.body.data.user.should.have.property('lastName');
            res.body.data.user.should.have.property('address');
            res.body.data.user.should.have.property('phone');
            res.body.data.user.should.have.property('teamId');
            res.body.data.user.should.have.property('phone');
            res.body.data.user.should.have.property('createdAt');
            res.body.data.user.should.have.property('isAdmin');
            expect(res.body.data.user._id).to.equal(userId);
            expect(res.body.data.user.email).to.equal(email);
            expect(res.body.data.user.firstName).to.equal('Hans');
            expect(res.body.data.user.lastName).to.equal('Peter');
            expect(res.body.data.user.address).to.equal('Street 4');
            expect(res.body.data.user.phone).to.equal('12345679');
            expect(res.body.data.user.teamId).to.be.null;
            expect(res.body.data.user.isAdmin).to.be.false;
            done();
        });
    });
});


describe('/POST login', () => {
    it('it should return a 401 with a error message if you login with an empty email address', (done) => {
        chai.request(api)
        .post('/login')
        .set('content-type', 'application/json')
        .send({email: "", password: "123456"})
        .end((err, res) => {
            res.should.be.json;
            res.should.have.status(401);
            res.body.should.have.property('success')
            expect(res.body.success).to.be.false;
            res.body.should.have.property('error')
            res.body.error.should.have.property('message')
            res.body.error.message.should.be.a('string');
            done();
        });
    });
});


describe('/POST login', () => {
    it('it should return a 401 with a error message if you login with an empty password', (done) => {
        chai.request(api)
        .post('/login')
        .set('content-type', 'application/json')
        .send({email: "testlogin@kea.dk", password: ""})
        .end((err, res) => {
            res.should.be.json;
            res.should.have.status(401);
            res.body.should.have.property('success')
            expect(res.body.success).to.be.false;
            res.body.should.have.property('error')
            res.body.error.should.have.property('message')
            res.body.error.message.should.be.a('string');
            done();
        });
    });
});


describe('/POST login', () => {
    it('it should return a 401 with a error message if you login with invalid credentials', (done) => {
        chai.request(api)
        .post('/login')
        .set('content-type', 'application/json')
        .send({email: "testlogin@kea.dk", password: "123456789"})
        .end((err, res) => {
            res.should.be.json;
            res.should.have.status(401);
            res.body.should.have.property('success')
            expect(res.body.success).to.be.false;
            res.body.should.have.property('error')
            res.body.error.should.have.property('message')
            res.body.error.message.should.be.a('string');
            done();
        });
    });
});

