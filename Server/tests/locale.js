// Import the dependencies for testing
const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require('../server/server');

// Configure chai
chai.use(chaiHttp);
const should = chai.should();

var token = '';
var newId = '';

describe("locales", () => {
    describe("GET /", () => {
      //Test get my locales
      it("should get created locales", (done) => {
        chai.request(app)
          .post(`/login`)
          .send({email: 'a@a.com', password: '123'})
          .end((err, res) => {
            res.should.have.status(200);
            token = res.body.token;
            res.body.should.be.a('object');
            chai.request(app)
              .get(`/my-locales`)
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
            let testLocale = {
                name: 'test',
                alias: 'test',
                code: 'test'
            }
            chai.request(app)
                .post('/locales')
                .set('Authorization', `Bearer ${token}`)
                .send(testLocale)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    newId = res.body.localeDB._id;
                    done();
                });
        });
    });
    describe("PUT /", () => {
        //Test edit created locale
        it("should edit the new locale", (done) => {
            let editLocale = {name: "test2"}
            chai.request(app)
                .put(`/locales/${newId}`)
                .send(editLocale)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        //Test edit locale non existing
        it("should throw error", (done) => {
            let id = 1;
            let editLocale = {name: "test2"}
            chai.request(app)
                .put(`/locales/${id}`)
                .send(editLocale)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    describe("DELETE /", () => {
        //Test delete created locale
        it("should delete the new locale", (done) => {
            chai.request(app)
            .delete(`/locales/${newId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
        //Test delete locale non existing
        it("should throw error delete", (done) => {
            let id = 1;
            chai.request(app)
                .delete(`/locales/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
  });