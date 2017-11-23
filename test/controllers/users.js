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

