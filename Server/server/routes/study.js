const express = require("express");
const cors = require('cors');
const Study = require('../models/study');
const VerifyToken = require('../auth/VerifyToken');

const app = express();
app.use(cors());

app.get('/my-studies', VerifyToken, async(req, res) => {
    await Study.find({ user: req.decoded.subject }, (err, studies) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err.message
            });
        }
        res.status(200).json({
            ok: true,
            studies
        });
    });
});

app.get('/studies', VerifyToken, (req, res) => {
    Study.find((err, studies) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            studies
        });
        return;
    });
});

app.get('/public-studies', VerifyToken, (req, res) => {
    Study.find({ public: true }, (err, public) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            public
        });
    });
});

app.post('/studies', VerifyToken, (req, res) => {
    let body = req.body;

    let study = new Study({
        id: body.id,
        locale: body.locale,
        domain: body.domain,
        task: body.task,
        maxGlobalTime: body.maxGlobalTime,
        minBookmarks: body.minBookmarks,
        maxBookmarks: body.maxBookmarks,
        minSnippetsPerPage: body.minSnippetsPerPage,
        maxSnippetsPerPage: body.maxSnippetsPerPage,
        minSnippetWordLength: body.minSnippetWordLength,
        maxSnippetWordLength: body.maxSnippetWordLength,
        snippetWordTruncateThreshold: body.snippetWordTruncateThreshold,
        minSynthesisWordLength: body.minSynthesisWordLength,
        minSynthesisCharLength: body.minSynthesisCharLength,
        syhtesisAutosaveInterval: body.syhtesisAutosaveInterval,
        taskPage: body.taskPage,
        replaceWithRelevantDocuments: body.replaceWithRelevantDocuments,
        avatar: body.avatar,
        stages: body.stages,
        user: body.user,
        public: body.public,
        tags: body.tags
    });

    if (body.maxStars) {
        study.set('maxStars', body.maxStars);
    }

    study.save((err, studyDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err.message
            });
        }
        res.status(200).json({
            ok: true,
            study: studyDB
        });
    });
});

app.get('/study/:id', VerifyToken, (req, res) => {
    Study.findById(req.params.id, (err, study) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            study
        });
    });
});

app.put('/study/:id', VerifyToken, (req, res) => {
    Study.findByIdAndUpdate(req.params.id, req.body, (err, study) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            study
        });
    });
});

app.delete('/study/:id', VerifyToken, (req, res) => {
    Study.findByIdAndRemove(req.params.id, (err, study) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            message: "deleted successufully"
        });
    });
});


module.exports = app;