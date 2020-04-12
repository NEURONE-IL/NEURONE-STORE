// Import the dependencies for testing
const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require('../server/server');

// Configure chai
chai.use(chaiHttp);
const should = chai.should();

var token = '';
var newId = '';

describe("stages", () => {
    describe("GET /", () => {
        //Test get my stages
        it("should get created stages", (done) => {
            chai.request(app)
                .post(`/login`)
                .send({email: 'a@a.com', password: '123'})
                .end((err, res) => {
                    res.should.have.status(200);
                    token = res.body.token;
                    res.body.should.be.a('object');
                    chai.request(app)
                        .get(`/my-stages`)
                        .set('Authorization', `Bearer ${token}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            done();
                    });
                });
        }); 
        //Test get error of stage
        it("should  get error", (done) => {
            chai.request(app)
                .get('/stage/1')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
            });
        });
    });
    describe("POST /", () => {
        //Test post and delete a stage
        it("should post and delete a test stage", (done) => {
            let testStage = {
                id: 'test',
                time: 1,
                type: 'test',
                state: 'test',
                stage: 'test',
                page: 'test',
                slides: 'test',
                alert: 'test',
                form: 'test',
                tips: 'test',
                avatar: 'test',
                avatarImage: 'test',
                answerType: 'test',
                questionnaire: 'test'
            }
            chai.request(app)
                .post('/stages')
                .set('Authorization', `Bearer ${token}`)
                .send(testStage)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    newId = res.body.stage._id;
                    done();
                });
        });
    });
    describe("PUT /", () => {
        //Test edit created stage
        it("should edit the new stage", (done) => {
            let editStage = {id: "test2"}
            chai.request(app)
                .put(`/stage/${newId}`)
                .send(editStage)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        //Test edit stage non existing
        it("should throw error", (done) => {
            let id = 1;
            let editStage = {name: "test2"}
            chai.request(app)
                .put(`/stage/${id}`)
                .send(editStage)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    describe("DELETE /", () => {
        //Test delete created stage
        it("should delete the new stage", (done) => {
            chai.request(app)
            .delete(`/stage/${newId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
        //Test delete stage non existing
        it("should throw error delete", (done) => {
            let id = 1;
            chai.request(app)
                .delete(`/stage/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
  });