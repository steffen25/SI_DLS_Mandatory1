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
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.have.property('__v')
                res.body.should.have.property('_id')
                res.body.should.have.property('days')
                res.body.days.should.be.a('array');
                // 5 days monday to friday
                res.body.days.length.should.be.eql(5);
                //expect(res.body.days).to.have.deep.property('[0].monday', '1');
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
            .send({ email: "newtestuser222@kea.dk", password: "123456" })
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


describe('/GET schedules for week for new user with a new team and a new schedule', () => {
    var userId;
    before(function (done) {
        var email = "newtestuser444@kea.dk";
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
                userId = res.body.data.user._id;
                done();
            });
    });

    var token;
    before(function (done) {
        chai.request(api)
            .post('/login')
            .set('content-type', 'application/json')
            .send({ email: "newtestuser444@kea.dk", password: "123456" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.have.property('token')
                token = res.body.data.token;
                done();
            });
    });

    var scheduleId;
    before(function (done) {
        var schedule = {
            "monday": "System testing",
            "tuesday": "Database",
            "wednesday": "Software design",
            "thursday": "Software construction",
            "friday": "Project work"
        }

        chai.request(api)
            .post('/schedules')
            .set('Authorization', token)
            .send(schedule)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(201);
                scheduleId = res.body._id
                done();
            });
    });
    
    var teamId;
    before(function (done) {
        var team = {
            teamName: "This is a test team HCI",
            scheduleId: scheduleId,
            classRoom: "A19"
        }
        chai.request(api)
            .post('/teams')
            .set('Authorization', token)
            .set('content-type', 'application/json')
            .send(team)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(201);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.data.should.be.an('object');
                res.body.data.should.have.property('__v');
                res.body.data.should.have.property('_id');
                res.body.data.should.have.property('teamName');
                res.body.data.should.have.property('scheduleId');
                res.body.data.should.have.property('classRoom');
                expect(res.body.data.teamName).to.equal("This is a test team HCI");
                expect(res.body.data.scheduleId).to.equal(scheduleId);
                expect(res.body.data.classRoom).to.equal("A19");
                teamId = res.body.data._id;
                done();
            });
    });

    // assign the user the team
    before(function (done) {
        chai.request(api)
        .put('/users/'+userId)
        .set('Authorization', token)
        .set('content-type', 'application/json')
        .send({"teamId": teamId})
        .end((err, res) => {
            res.should.be.json;
            res.should.have.status(200);
            expect(res.body.data.teamId).to.equal(teamId);
            done();
        });
    });

    // login again to get the new assigned team Id in the token
    before(function (done) {
        chai.request(api)
            .post('/login')
            .set('content-type', 'application/json')
            .send({ email: "newtestuser444@kea.dk", password: "123456" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.have.property('token')
                token = res.body.data.token;
                done();
            });
    });



    it('it should return 200 with the schedules we have defined in the before clause', (done) => {
        chai.request(api)
        .get('/schedules/week/47')
        .set('Authorization', token)
        .end((err, res) => {
            res.should.be.json;
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(5);
            expect(res.body[0]).to.have.property('monday');
            expect(res.body[0].monday).to.equal("System testing");
            expect(res.body[1]).to.have.property('tuesday');
            expect(res.body[1].tuesday).to.equal("Database");
            expect(res.body[2]).to.have.property('wednesday');
            expect(res.body[2].wednesday).to.equal("Software design");
            expect(res.body[3]).to.have.property('thursday');
            expect(res.body[3].thursday).to.equal("Software construction");
            expect(res.body[4]).to.have.property('friday');
            expect(res.body[4].friday).to.equal("Project work");
            done();
        });
    });
});
