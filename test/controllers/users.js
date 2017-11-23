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
    it('it should GET all the users', (done) => {
        chai.request(api)
            .get('/users')
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(200);
                expect(res.body.success).to.be.true;               
                res.body.data.should.be.an('object');
                res.body.data.users.should.be.a('array');
                //res.body.length.should.be.eql(8);
                done();
            });
    });
});


describe('/POST user', () => {
    it('it should create a user', (done) => {

        var uuid = require("uuid");
        var id = uuid.v4();

        var user = {
            password : "123456",
            email: "alison"+id+"@kea.dk",
            firstName: "Alison",
            lastName: "Johnson",
            address: "Street 2",
            phone: "12345678",
            teamId: null,
            isAdmin: true
        }

        chai.request(api)
            .post('/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('user')
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('firstName');
                res.body.user.should.have.property('lastName');
                res.body.user.should.have.property('address');
                res.body.user.should.have.property('phone');
                done();
            });
    });
});



//////////////////////////////////////////////////////////////////////////////////////////////////////
// Test for ensuring that a user and a proper status code is returned when an existing user id is provided.
//////////////////////////////////////////////////////////////////////////////////////////////////////

// describe('/GET user with id', () => {
//     it('it should GET the user with a specific id', (done) => {
//         chai.request(api)
//             .get('/users/5a0d64fcb1bc250014b36c2d')
//             .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//         //res.body.length.should.be.eql(8);
//         done();
//         });
//     });
// });

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Test for ensuring that a valid error is returned to the user, when a nonexistant user id is provided.
//////////////////////////////////////////////////////////////////////////////////////////////////////

describe('/GET user with incorrect id', () => {
    it('it should return a 404 error code since no user has the specified id', (done) => {
        chai.request(api)
            .get('/users/-1')
            .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
    //res.body.length.should.be.eql(8);
    done();
        });
    });
});




describe('/POST user', () => {
    it('it should POST a user ', (done) => {

        var uuid = require("uuid");
        var id = uuid.v4();

        var user = {
            password : "123456",
            email: "alison"+id+"@kea.dk",
            firstName: "Alison",
            lastName: "Johnson",
            address: "Street 2",
            phone:"12345678",
            teamId: null,
            isAdmin: true
        }
        chai.request(api)
            .post('/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('user')
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('firstName');
                res.body.user.should.have.property('lastName');
                res.body.user.should.have.property('address');
                res.body.user.should.have.property('phone');
                done();
            });
    });
});









