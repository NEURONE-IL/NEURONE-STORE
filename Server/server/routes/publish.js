const express = require("express");
const cors = require('cors');
const Publish = require('../models/publish');
const VerifyToken = require('../auth/VerifyToken');

const app = express();
app.use(cors());

app.get('/my-publishes', VerifyToken, (req, res) => {
    Publish.find({user: req.decoded.subject}, (err, publishes) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            publishes
        });
    });
});

app.post('/publish', VerifyToken, (req, res) => {
    let body = req.body;
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    var today = dd + '/' + mm + '/' + yyyy;
    var publish = new Publish({
        date: today,
        user: req.decoded.subject,
        //password: body.password,
        docs: body.docs,
        study: body.study,
        owner: body.owner,
        questions: body.questions,
        questionnaires: body.questionnaires,
        stages: body.stages,
        synthesis: body.synthesis
    });

    publish.save((err, pub) => {
        if(err){
            return res.status(409).json({
                ok: false,
                message: err
            });
        }
        res.status(200).json({
            ok: true,
            pub
        });
    });
});

app.delete('/publish/:id', VerifyToken, (req, res) => {
    Publish.findByIdAndRemove(req.params.id, (err, publish) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            message: "deleted successfully"
        });
    });
});

module.exports = app;