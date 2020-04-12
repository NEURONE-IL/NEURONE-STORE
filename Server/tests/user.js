// Import the dependencies for testing
const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require('../server/server');

//Tests
const document = 

// Configure chai
chai.use(chaiHttp);
const should = chai.should();

token = '';

describe("Users", () => {
  describe("POST /", () => {
    //Test login error
    it("should get an error bad credentials", (done) => {
      chai.request(app)
        .post(`/login`)
        .send({email: 'test123@test.com', password: '123123'})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
    //Test correct login
    it("should get an successfull login", (done) => {
      chai.request(app)
        .post(`/login`)
        .send({email: 'a@a.com', password: '123'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          token = res.body.token;
          done();
        });
    });
    //Test incorrect password
    it("should get an error from password", (done) => {
      chai.request(app)
        .post(`/login`)
        .send({email: 'a@a.com', password: '321'})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
    //Test bad register
    it("should get an error", (done) => {
      chai.request(app)
        .post(`/register`)
        .send({password: '123'})
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          done();
        });
    });
  });
  describe("GET /", () => {
    //Test get error
    it("should get an error", (done) => {
      chai.request(app)
        .get('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          done();
        });
    });
    //Test get info user
    it("should get info user", (done) => {
      chai.request(app)
        .get('/me')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});