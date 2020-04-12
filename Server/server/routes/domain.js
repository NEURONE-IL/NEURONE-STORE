const express = require("express");
const cors = require('cors');
const Domain = require('../models/domain');
const VerifyToken = require('../auth/VerifyToken');

const app = express();
app.use(cors());

app.get('/my-domains', VerifyToken, async(req, res) => {
    await Domain.find({ user: req.decoded.subject }, (err, domains) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            domains
        });
        return;
    });
});

app.post('/domains', VerifyToken, (req, res) => {
    let body = req.body;

    let domain = new Domain({
        name: body.name,
        alias: body.alias,
        code: body.code,
        description: body.description,
        user: req.decoded.subject
    });

    domain.save((err, domainDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'document name already exists'
            });
        }
        res.status(200).json({
            ok: true,
            domainDB
        });
    });
});

app.put('/domains/:id', VerifyToken, (req, res) => {
    Domain.findByIdAndUpdate(req.params.id, req.body, (err, domain) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            domain
        });
    });
});

app.delete('/domains/:id', VerifyToken, (req, res) => {
    Domain.findByIdAndRemove(req.params.id, (err, domain) => {
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