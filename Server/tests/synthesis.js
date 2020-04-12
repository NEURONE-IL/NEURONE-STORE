// Import the dependencies for testing
const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require('../server/server');

// Configure chai
chai.use(chaiHttp);
const should = chai.should();

var token = '';
var newId = '';

describe("synthesis", () => {
    describe("GET /", () => {
      //Test get my synthesis
      it("should get created synthesis", (done) => {
        chai.request(app)
          .post(`/login`)
          .send({email: 'a@a.com', password: '123'})
          .end((err, res) => {
            res.should.have.status(200);
            token = res.body.token;
            res.body.should.be.a('object');
            chai.request(app)
              .get(`/my-synthesis`)
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
              });
          });
      }); 
    });
    describe("POST /", () => {
        //Test post and delete a document
        it("should post and delete a test doc", (done) => {
            let testSynthesis = {
                title: 'test',
                synthesisId: 'test',
            }
            chai.request(app)
                .post('/synthesis')
                .set('Authorization', `Bearer ${token}`)
                .send(testSynthesis)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    newId = res.body.synthesis._id;
                    done();
                });
        });
    });
    describe("PUT /", () => {
        //Test edit created synthesis
        it("should edit the new synthesis", (done) => {
            let editSynthesis = {name: "test2"}
            chai.request(app)
                .put(`/synthesis/${newId}`)
                .send(editSynthesis)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        //Test edit synthesis non existing
        it("should throw error", (done) => {
            let id = 1;
            let editSynthesis = {name: "test2"}
            chai.request(app)
                .put(`/synthesis/${id}`)
                .send(editSynthesis)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    describe("DELETE /", () => {
        //Test delete created synthesis
        it("should delete the new synthesis", (done) => {
            chai.request(app)
            .delete(`/synthesis/${newId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
        //Test delete synthesis non existing
        it("should throw error delete", (done) => {
            let id = 1;
            chai.request(app)
                .delete(`/synthesis/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
  });