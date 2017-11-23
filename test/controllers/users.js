let mongoose = require("mongoose");
let User = require('../../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
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

