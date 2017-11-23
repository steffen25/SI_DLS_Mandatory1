const mongoose = require("mongoose");
const User = require('../../models/user');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
chai.use(chaiHttp);


describe('/GET users', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
          .get('/users')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              //res.body.length.should.be.eql(8);
            done();
          });
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Test for ensuring that a user and a proper status code is returned when an existing user id is provided.
//////////////////////////////////////////////////////////////////////////////////////////////////////

describe('/GET user with id', () => {
    it('it should GET the user with a specific id', (done) => {
        chai.request(server)
            .get('/users/5a0d64fcb1bc250014b36c2d')
            .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
        //res.body.length.should.be.eql(8);
        done();
        });
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Test for ensuring that a valid error is returned to the user, when a nonexistant user id is provided.
//////////////////////////////////////////////////////////////////////////////////////////////////////

describe('/GET user with incorrect id', () => {
    it('it should return a 404 error code since no user has the specified id', (done) => {
        chai.request(server)
            .get('/users/-1')
            .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
    //res.body.length.should.be.eql(8);
    done();
        });
    });
});








