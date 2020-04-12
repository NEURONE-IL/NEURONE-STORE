// Import the dependencies for testing
const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require('../server/server');

// Configure chai
chai.use(chaiHttp);
const should = chai.should();

var token = '';
var newId = '';

describe("tasks", () => {
    describe("GET /", () => {
      //Test get my tasks
      it("should get created tasks", (done) => {
        chai.request(app)
          .post(`/login`)
          .send({email: 'a@a.com', password: '123'})
          .end((err, res) => {
            res.should.have.status(200);
            token = res.body.token;
            res.body.should.be.a('object');
            chai.request(app)
              .get(`/my-tasks`)
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
        //Test post and delete a task
        it("should post and delete a test task", (done) => {
            let testTask = {
                name: 'test',
                alias: 'test',
                code: 'test',
                description: 'test'
            }
            chai.request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send(testTask)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    newId = res.body.taskDB._id;
                    done();
                });
        });
    });
    describe("PUT /", () => {
        //Test edit created task
        it("should edit the new task", (done) => {
            let editTask = {name: "test2"}
            chai.request(app)
                .put(`/tasks/${newId}`)
                .send(editTask)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        //Test edit task non existing
        it("should throw error", (done) => {
            let id = 1;
            let editTask = {name: "test2"}
            chai.request(app)
                .put(`/tasks/${id}`)
                .send(editTask)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    describe("DELETE /", () => {
        //Test delete created task
        it("should delete the new task", (done) => {
            chai.request(app)
            .delete(`/tasks/${newId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
        //Test delete task non existing
        it("should throw error delete", (done) => {
            let id = 1;
            chai.request(app)
                .delete(`/tasks/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
  });