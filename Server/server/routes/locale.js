const express = require("express");
const cors = require('cors');
const Locale = require('../models/locale');
const VerifyToken = require('../auth/VerifyToken');

const app = express();
app.use(cors());

app.get('/my-locales', VerifyToken, async(req, res) => {
    await Locale.find({ user: req.decoded.subject }, (err, locales) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            locales
        });
        return;
    });
});

app.post('/locales', VerifyToken, (req, res) => {
    let body = req.body;

    let locale = new Locale({
        name: body.name,
        alias: body.alias,
        code: body.code,
        user: req.decoded.subject
    });

    locale.save((err, localeDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'document name already exists'
            });
        }
        res.status(200).json({
            ok: true,
            localeDB
        });
    });
});

app.put('/locales/:id', VerifyToken, (req, res) => {
    Locale.findByIdAndUpdate(req.params.id, req.body, (err, locale) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            locale
        });
    });
});

app.delete('/locales/:id', VerifyToken, (req, res) => {
    Locale.findByIdAndRemove(req.params.id, (err, locale) => {
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