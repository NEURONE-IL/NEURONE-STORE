const express = require("express");
const cors = require('cors');
const Stage = require('../models/stage');
const VerifyToken = require('../auth/VerifyToken');

const app = express();
app.use(cors());

app.get('/my-stages', VerifyToken, async(req, res) => {
    await Stage.find({ user: req.decoded.subject }, (err, stages) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            stages
        });
        return;
    });
});

app.post('/stages', VerifyToken, (req, res) => {
    let body = req.body;
    //console.log(body);
    let stage = new Stage({
        id: body.id,
        time: body.time,
        user: req.decoded.subject,
        type: body.type,
        state: body.state
    });

    if (body.stage) {
        stage.set('stage', body.stage);
    }
    if (body.page) {
        stage.set('page', body.page);
    }
    if (body.slides) {
        stage.set('slides', body.slides);
    }
    if (body.alert) {
        stage.set('reminderAlert', body.alert);
    }
    if (body.form) {
        stage.set('form', body.form);
    }
    if (body.tips) {
        stage.set('tips', body.tips);
    }
    if (body.avatar) {
        stage.set('avatar', body.avatar);
    }
    if (body.avatarImage) {
        stage.set('avatarImage', body.avatarImage);
    }
    if (body.answerType) {
        stage.set('answerType', body.answerType);
    }
    if (body.questionnaire) {
        stage.set('questionnaire', body.questionnaire);
    }

    stage.save((err, stageDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err.message
            });
        }
        res.status(200).json({
            ok: true,
            stage: stageDB
        });
    })
});

app.get('/stage/:id', VerifyToken, (req, res) => {
    Stage.findById(req.params.id, (err, stage) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err.message
            });
        }
        res.status(200).json({
            ok: true,
            stage
        });
    })
});

app.put('/stage/:id', VerifyToken, (req, res) => {
    Stage.findByIdAndUpdate(req.params.id, req.body, (err, stage) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err.message
            });
        }
        res.status(200).json({
            ok: true,
            stage
        });
    });
});

app.delete('/stage/:id', VerifyToken, (req, res) => {
    Stage.findByIdAndRemove(req.params.id, (err, stage) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err.message
            });
        }
        res.status(200).json({
            ok: true,
            message: "deleted successfully"
        });
    });
});

module.exports = app;