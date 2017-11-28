const mongoose = require("mongoose");
const User = require('../../models/user');
const Team = require('../../models/team');
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


describe('/GET teams', () => {
    before(function (done) {
        var Team = mongoose.model('Team');
        Team.remove({}, function (err) {
            if (err) { console.log(err) }
            done();
        });
    });

    it('it should return 200 with an empty array of teams', (done) => {
        chai.request(api)
            .get('/teams')
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(200);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.have.property('data')
                res.body.data.should.be.an('object');
                res.body.data.should.have.property('teams')
                res.body.data.teams.should.be.an('array');
                res.body.data.teams.length.should.be.eql(0);
                done();
            });
    });
});

describe('/POST teams', () => {
    var token;
    before(function (done) {
        var Team = mongoose.model('Team');
        Team.remove({}, function (err) {
            if (err) { console.log(err) }
            done();
        });
    });
    before(function (done) {

        var user = {
            password: "123456",
            email: "adminuser@kea.dk",
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

    before(function (done) {
        chai.request(api)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ email: "adminuser@kea.dk", password: "123456" })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.have.property('token')
            token = res.body.data.token;
            done();
        });
    });

    it('it should return 201 since we set a Authorization header as an user with admin priviliges', (done) => {
        var team = {
            teamName: "This is a test team",
            scheduleId: "58fde162c5270ef459fd4d6d",
            classRoom: "A18"
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
                expect(res.body.data.teamName).to.equal("This is a test team");
                expect(res.body.data.scheduleId).to.equal("58fde162c5270ef459fd4d6d");
                expect(res.body.data.classRoom).to.equal("A18");
                done();
            });
    });
});

describe('/GET teams', () => {
    it('it should return 200 with an array of 1 team', (done) => {
        chai.request(api)
            .get('/teams')
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(200);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.true;
                res.body.should.have.property('data')
                res.body.data.should.be.an('object');
                res.body.data.should.have.property('teams')
                res.body.data.teams.should.be.an('array');
                res.body.data.teams.length.should.be.eql(1);
                done();
            });
    });
});

describe('/POST teams', () => {
    var token;

    before(function (done) {
        chai.request(api)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ email: "adminuser@kea.dk", password: "123456" })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.have.property('token')
            token = res.body.data.token;
            done();
        });
    });

    it('it should return 400 since we cant create a team with the same identical name UNIQUE constraint added to the model', (done) => {
        var team = {
            teamName: "This is a test team",
            scheduleId: "58fde162c5270ef459fd4d6d",
            classRoom: "A18"
        }
        chai.request(api)
            .post('/teams')
            .set('Authorization', token)
            .set('content-type', 'application/json')
            .send(team)
            .end((err, res) => {
                res.should.be.json;
                res.should.have.status(400);
                res.body.should.have.property('success')
                expect(res.body.success).to.be.false;
                res.body.should.have.property('error');
                res.body.error.should.be.an('object');
                res.body.error.should.have.property('code');
                res.body.error.should.have.property('op');
                res.body.error.op.should.be.an('object');
                res.body.error.op.should.have.property('teamName');
                res.body.error.op.should.have.property('scheduleId');
                res.body.error.op.should.have.property('classRoom');
                expect(res.body.error.op.teamName).to.equal("This is a test team");
                expect(res.body.error.op.scheduleId).to.equal("58fde162c5270ef459fd4d6d");
                expect(res.body.error.op.classRoom).to.equal("A18");
                done();
            });
    });

    after(function (done) {
        chai.request(api)
        .get('/teams')
        .end((err, res) => {
            res.should.be.json;
            res.should.have.status(200);
            res.body.should.have.property('success')
            expect(res.body.success).to.be.true;
            res.body.should.have.property('data')
            res.body.data.should.be.an('object');
            res.body.data.should.have.property('teams')
            res.body.data.teams.should.be.an('array');
            // Should still be 1 since the above test didnt succeed.
            res.body.data.teams.length.should.be.eql(1);
            done();
        });
    });
});