const express = require("express");
const cors = require('cors');
const Question = require('../models/question');
const VerifyToken = require('../auth/VerifyToken');

const app = express();
app.use(cors());

app.get('/my-questions', VerifyToken, async(req, res) => {
    await Question.find({ user: req.decoded.subject }, (err, questions) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            questions
        });
        return;
    });
});

app.get('/questions', async(req, res) => {
    await Question.find((err, questions) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            questions
        });
        return;
    })
});

app.post('/questions', VerifyToken, (req, res) => {
    let body = req.body;
    //console.log(body);
    let question = new Question({
        title: body.title,
        questionId: body.questionId,
        type: body.type,
        required: body.required,
        hint: body.hint,
        user: req.decoded.subject
    });

    if (body.options) {
        question.set('options', body.options);
    } if (body.step) {
        question.set('min', body.min);
        question.set('max', body.max);
        question.set('step', body.step);
        question.set('minLabel', body.minLabel);
        question.set('maxLabel', body.maxLabel);
    } if (body.maxStars) {
        question.set('maxStars', body.maxStars);
    }

    question.save((err, questionDB) => {
        if (err) {
            return res.status(409).json({
                ok: false,
                message: err.errors.questionId.message
            });
        }
        res.status(200).json({
            ok: true,
            question: questionDB
        });
    })
});

app.get('/question/:id', VerifyToken, (req, res) => {
    Question.findById(req.params.id, (err, question) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            question
        });
    })
});

app.put('/question/:id', VerifyToken, (req, res) => {
    Question.findByIdAndUpdate(req.params.id, req.body, (err, question) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            question
        });
    });
});

app.delete('/question/:id', VerifyToken, (req, res) => {
    Question.findByIdAndRemove(req.params.id, (err, question) => {
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