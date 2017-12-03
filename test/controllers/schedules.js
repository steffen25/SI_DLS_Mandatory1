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


describe('/POST schedules', () => {

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

    it('it should return 401 since the user is not admin', (done) => {

        chai.request(api)
            .post('/schedules')
            .set('Authorization', token)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(401);
                done();
            });
    });
});


describe('/POST schedules', () => {

    before(function (done) {
        var email = "newtestuser222@kea.dk";
        var password = "123456";

        var user = {
            password: password,
            email: email,
            firstName: "Hans",
            lastName: "Peter",
            address: "Street 4",
            phone: "12245679",
            teamId: null,
            isAdmin: true
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

    var token;
    before(function (done) {
        chai.request(api)
            .post('/login')
            .set('content-type', 'application/json')
            .send({ email: "newtestuser222@kea.dk", password: "123456" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.have.property('token')
                token = res.body.data.token;
                done();
            });
    });



    it('it should return 200 since the user is an admin', (done) => {
        var schedule = {
            "monday": "1",
            "tuesday": "2",
            "wednesday": "3",
            "thursday": "4",
            "friday": "5"
        }

        chai.request(api)
            .post('/schedules')
            .set('Authorization', token)
            .send(schedule)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(201);
                done();
            });
    });
});


describe('/POST schedules', () => {

    before(function (done) {
        var email = "newtestuser333@kea.dk";
        var password = "123456";

        var user = {
            password: password,
            email: email,
            firstName: "Hans",
            lastName: "Peter",
            address: "Street 4",
            phone: "12245679",
            teamId: null,
            isAdmin: true
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

    var token;
    before(function (done) {
        chai.request(api)
            .post('/login')
            .set('content-type', 'application/json')
            .send({ email: "newtestuser333@kea.dk", password: "123456" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.have.property('token')
                token = res.body.data.token;
                done();
            });
    });



    it('it should return 400 since you have to specify all days from monday to friday when you create a schedule', (done) => {
        var schedule = {
            "monday": "1",
            "tuesday": "2",
            "wednesday": "3",
            "thursday": "4"
        }

        chai.request(api)
            .post('/schedules')
            .set('Authorization', token)
            .send(schedule)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(400);
                done();
            });
    });
});
