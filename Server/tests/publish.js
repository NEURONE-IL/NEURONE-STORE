// Import the dependencies for testing
const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require('../server/server');

// Configure chai
chai.use(chaiHttp);
const should = chai.should();

var token = '';
var newId = '';

describe("publishes", () => {
    describe("GET /", () => {
      //Test get my publishes
      it("should get created publishes", (done) => {
        chai.request(app)
          .post(`/login`)
          .send({email: 'a@a.com', password: '123'})
          .end((err, res) => {
            res.should.have.status(200);
            token = res.body.token;
            res.body.should.be.a('object');
            chai.request(app)
              .get(`/my-publishes`)
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
        //Test post a publish
        it("should post a test publish", (done) => {
            let testPublish = {
                docs: 'test',
                study: 'test',
                owner: 'test',
                questions: 'test',
                questionnaires: 'test',
                stages: 'test'
            }
            chai.request(app)
                .post('/publish')
                .set('Authorization', `Bearer ${token}`)
                .send(testPublish)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    newId = res.body.pub._id;
                    done();
                });
        });
    });
    describe("DELETE /", () => {
        //Test delete created publish
        it("should delete the new publish", (done) => {
            chai.request(app)
            .delete(`/publish/${newId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
        //Test delete publish non existing
        it("should throw error delete", (done) => {
            let id = 1;
            chai.request(app)
                .delete(`/publish/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
  });