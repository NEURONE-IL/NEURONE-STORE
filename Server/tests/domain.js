// Import the dependencies for testing
const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require('../server/server');

// Configure chai
chai.use(chaiHttp);
const should = chai.should();

var token = '';
var newId = '';

describe("Domains", () => {
    describe("GET /", () => {
      //Test get my Domains
      it("should get created Domains", (done) => {
        chai.request(app)
          .post(`/login`)
          .send({email: 'a@a.com', password: '123'})
          .end((err, res) => {
            res.should.have.status(200);
            token = res.body.token;
            res.body.should.be.a('object');
            chai.request(app)
              .get(`/my-domains`)
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
        //Test post a document
        it("should post  a test doc", (done) => {
            let testDoc = {
                name: 'test',
                alias: 'test',
                code: 'test',
                description: 'test'
            }
            chai.request(app)
                .post('/domains')
                .set('Authorization', `Bearer ${token}`)
                .send(testDoc)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    newId = res.body.domainDB._id;
                    done();
                });
        });
    });
    describe("PUT /", () => {
        //Test edit created doc
        it("should edit the new domain", (done) => {
            let editDomain = {name: "test2"}
            chai.request(app)
                .put(`/domains/${newId}`)
                .send(editDomain)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        //Test edit domain non existing
        it("should throw error", (done) => {
            let id = 1;
            let editDomain = {name: "test2"}
            chai.request(app)
                .put(`/domains/${id}`)
                .send(editDomain)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    describe("DELETE /", () => {
        //Test delete created domain
        it("should delete the new domain", (done) => {
            chai.request(app)
            .delete(`/domains/${newId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
        //Test delete domain non existing
        it("should throw error delete", (done) => {
            let id = 1;
            chai.request(app)
                .delete(`/domains/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});

