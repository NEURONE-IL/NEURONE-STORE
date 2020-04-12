// Import the dependencies for testing
const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require('../server/server');

// Configure chai
chai.use(chaiHttp);
const should = chai.should();

var token = '';
var newId = '';

describe("Documents", () => {
    describe("GET /", () => {
      //Test get my documents
      it("should get created documents", (done) => {
        chai.request(app)
          .post(`/login`)
          .send({email: 'a@a.com', password: '123'})
          .end((err, res) => {
            res.should.have.status(200);
            token = res.body.token;
            res.body.should.be.a('object');
            chai.request(app)
              .get(`/my-documents`)
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
            let testDoc = {
                docName: 'test',
                title: 'test',
                locale: 'test',
                relevant: true,
                task: ['test'],
                domain: ['test'],
                keywords: ['test'],
                date: new Date(),
                url: 'test',
                maskedUrl: 'test',
                searchSnippet: 'test'
            }
            chai.request(app)
                .post('/documents')
                .set('Authorization', `Bearer ${token}`)
                .send(testDoc)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    newId = res.body.doc._id;
                    done();
                });
        });
        it("should return error on preview", (done) => {
            let test = {};
            chai.request(app)
                .post('/preview-document')
                .set('Authorization', `Bearer ${token}`)
                .send(test)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    describe("PUT /", () => {
        //Test edit created doc
        it("should edit the new doc", (done) => {
            let editDoc = {title: "test2"}
            chai.request(app)
                .put(`/documents/${newId}`)
                .send(editDoc)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        //Test edit doc non existing
        it("should throw error", (done) => {
            let id = 1;
            let editDoc = {title: "test2"}
            chai.request(app)
                .put(`/documents/${id}`)
                .send(editDoc)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    describe("DELETE /", () => {
        //Test delete created doc
        it("should delete the new doc", (done) => {
            chai.request(app)
            .delete(`/documents/${newId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
        //Test delete doc non existing
        it("should throw error delete", (done) => {
            let id = 1;
            chai.request(app)
                .delete(`/documents/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
  });