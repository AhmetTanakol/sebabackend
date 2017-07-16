var assert = require('assert');
var request = require('supertest');
var app = require('../app');


describe('REST API test', function () {

    var testuser;

    before(function (done) {

        testuser = {
            //to be received
            _id: undefined,
            //you should make sure this user does not exist yet and eventually choose a different username
            username: "testhans",
            password: "jaskdjasdjkas",
            //to be received
            token: undefined
        };

        //register testuser
        request(app)
            .post("/signup")
            .send({
                username: testuser.username,
                password: testuser.password
            })
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(function (res) {
                assert(res.body.token);

                var tokendata = parseToken(res.body.token);
                assert(tokendata.user.username == testuser.username);

                testuser._id = tokendata.user._id;
                testuser.token = res.body.token;

            })
            .end(done);
    });

    after(function (done) {
        //delete testuser
        request(app)
            .post("/unregister")
            .set("Authorization", "JWT " + testuser.token)
            .expect(200, done);
    });

    it("should login successfully", function (done) {
        request(app)
            .post("/login")
            .send({
                username: testuser.username,
                password: testuser.password
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({token: testuser.token}, done)

    });
});


function parseToken(token) {
    return JSON.parse(new Buffer(token.split('.')[1], 'base64').toString('ascii'));
}
