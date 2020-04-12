// Import the dependencies for testing
const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require('../server/server');

// Configure chai
chai.use(chaiHttp);
const should = chai.should();

var token = '';

describe("Questions", () => {
    describe("GET /", () => {
        // Test to get all Questions record
        it("should get all Questions record", (done) => {
             chai.request(app)
                 .get('/questions')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                  }).timeout(5000);
         });
        //Test to get single Question record
        it("should get an unauthorized request", (done) => {
          const id = 1;
          chai.request(app)
              .get(`/question/${id}`)
              .end((err, res) => {
                  res.should.have.status(401);
                  res.body.should.be.a('object');
                  done();
              });
         });
         //Test to created questions of test user
         it("should get an list of created questions", (done) => {
          chai.request(app)
            .post(`/login`)
            .send({email: 'a@a.com', password: '123'})
            .end((err, res) => {
              res.should.have.status(200);
              token = res.body.token;
              res.body.should.be.a('object');
              chai.request(app)
                .get(`/my-questions`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                });
              done();
            });
          });
          //Test to get question of test user
          it("should get an error question not exists", (done) => {
            const id = 1;
                chai.request(app)
                  .get(`/question/${id}`)
                  .set('Authorization', `Bearer ${token}`)
                  .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                  });
                done();
          });
    });
    describe("PUT /", () => {
      //Put unexisting question
      it("should get unexisting question error", (done) => {
        const id = 1;
        chai.request(app)
            .put(`/question/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
              });
      });
      
    });
    describe("DELETE /", () => {
      //Delete unexisting question
      it("should get unexisting question error", (done) => {
        const id = 1;
        chai.request(app)
            .delete(`/question/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
              });
      });
    });
    
    describe("POST /", () => {
        //Post bad question
        it("should get bad body error", (done) => {
          let question = {
              title: 'test'
          };
          chai.request(app)
              .post(`/questions`)
              .set('Authorization', `Bearer ${token}`)
              .send(question)
              .end((err, res) => {
                  res.should.have.status(409);
                  res.body.should.be.a('object');
                  done();
                });
        });
        
        //Post & delete question
        it("should get successfull question created & deleted", (done) => {
          let question = {
              title: 'test',
              questionId: 'test',
              type: 'test',
              required: true,
              hint: 'test',
              user: 'test',
              options: 'test',
              min: 5,
              max: 5,
              step: 5,
              minLabel: 5,
              maxLabel: 5,
              maxStars: 5
          };
          chai.request(app)
              .post(`/questions`)
              .set('Authorization', `Bearer ${token}`)
              .send(question)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  chai.request(app)
                      .delete(`/question/${res.body.question._id}`)
                      .set('Authorization', `Bearer ${token}`)
                      .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('object');
                          done();
                      });
                });
        });
      });
});