const mongoose = require("mongoose");
const User = require('../../models/user');
const Schedule = require('../../models/schedule');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const api = require('../../app');
const should = chai.should();
const expect = chai.expect
const assert = chai.assert
const CheckPort = require('../../util/checkport');
chai.use(chaiHttp);


CheckPort(process.env.NODE_PORT || 4000, function (inUse) {
    if (!inUse) {
        // Start the app process
        api.listen(process.env.NODE_PORT || 4000);
    }
});

describe('/GET schedules without being authenticated', () => {

    before(function (done) {
        var User = mongoose.model('User');
        User.remove({}, function (err) {
            if (err) { console.log(err) }
        });

        // Test user for tests below
        var email = "newtestuser@kea.dk";
        var password = "123456";

        var user = {
            password: password,
            email: email,
            firstName: "Hans",
            lastName: "Peter",
            address: "Street 4",
            phone: "12245679",
            teamId: null,
            isAdmin: false
        }

        chai.request(api)
            .post('/users')
            .set('content-type', 'application/json')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });


    // Clear all schedules and users from the test database
    it('it should return 401', (done) => {
        chai.request(api)
            .get('/schedules/week/47')
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(401);
                expect(res.body.success).to.be.false;
                res.body.should.have.property('error')
                res.body.error.should.be.a('string');
                done();
            });
    });
});

describe('/GET schedules with an authenticated user but with a out of range week number', () => {

    var token;
    before(function (done) {
        chai.request(api)
            .post('/login')
            .set('content-type', 'application/json')
            .send({ email: "newtestuser@kea.dk", password: "123456" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.have.property('token')
                token = res.body.data.token;
                done();
            });
    });

    it('it should return 400', (done) => {
        chai.request(api)
            .get('/schedules/week/477')
            .set('Authorization', token)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(400);
                expect(res.body.success).to.be.false;
                done();
            });
    });
});


describe('/GET schedules with an authenticated user but with a out of range week number', () => {

    var token;
    before(function (done) {
        chai.request(api)
            .post('/login')
            .set('content-type', 'application/json')
            .send({ email: "newtestuser@kea.dk", password: "123456" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.have.property('token')
                token = res.body.data.token;
                done();
            });
    });

    it('it should return 400', (done) => {
        chai.request(api)
            .get('/schedules/week/-1')
            .set('Authorization', token)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(400);
                expect(res.body.success).to.be.false;
                done();
            });
    });
});


describe('/GET schedules with an authenticated user with a valid week number, but no team', () => {

    var token;
    before(function (done) {
        chai.request(api)
            .post('/login')
            .set('content-type', 'application/json')
            .send({ email: "newtestuser@kea.dk", password: "123456" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.have.property('token')
                token = res.body.data.token;
                done();
            });
    });

    it('it should return 400', (done) => {
        chai.request(api)
            .get('/schedules/week/47')
            .set('Authorization', token)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(400);
                expect(res.body.success).to.be.false;
                done();
            });
    });
});
