const express = require("express");
const cors = require('cors');
const Synthesis = require('../models/synthesis');
const VerifyToken = require('../auth/VerifyToken');

const app = express();
app.use(cors());


app.get('/my-synthesis', VerifyToken, async(req, res) => {
    await Synthesis.find({ createdBy: req.decoded.subject }, (err, synthesis) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            synthesis
        });
        return;
    })
});

app.post('/synthesis', VerifyToken, (req, res) => {
    let body = req.body;

    let synthesis = new Synthesis({
        title: body.title,
        synthesisId: body.synthesisId,
        createdBy: req.decoded.subject
    });

    synthesis.save((err, synthesisDB) => {
        if (err) {
            return res.status(409).json({
                ok: false,
                message: err.message
            });
        }
        res.status(200).json({
            ok: true,
            synthesis: synthesisDB
        });
    })
});

app.put('/synthesis/:id', VerifyToken, (req, res) => {
    Synthesis.findByIdAndUpdate(req.params.id, req.body, (err, synthesis) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err.message
            });
        }
        res.status(200).json({
            ok: true,
            synthesis
        });
    });
});

app.delete('/synthesis/:id', VerifyToken, (req, res) => {
    Synthesis.findByIdAndRemove(req.params.id, (err, synthesis) => {
        if (err) {
            return res.status(404).json({
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