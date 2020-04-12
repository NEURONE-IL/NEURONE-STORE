const express = require("express");
const cors = require('cors');
const Document = require('../models/document');
const VerifyToken = require('../auth/VerifyToken');
const docDownloader = require('../utils/documentDownloader');

const app = express();
app.use(cors());

app.get('/my-documents', VerifyToken, async(req, res) => {
    await Document.find({ user: req.decoded.subject }, (err, documents) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            documents
        });
        return;
    });
});

app.post('/preview-document', VerifyToken, (req, res) => {
    let body = req.body;

    docDownloader.preview(body, req.decoded.subject, (err, document) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                message: err
            });
        }
        //console.log(document);
        res.status(200).json({
            ok: true,
            document
        });
    });
});

app.post('/documents', VerifyToken, (req, res) => {
    let body = req.body;

    let document = new Document({
        docName: body.docName,
        title: body.title,
        locale: body.locale,
        relevant: body.relevant,
        task: body.task,
        domain: body.domain,
        keywords: body.keywords,
        date: body.date,
        url: body.url,
        maskedUrl: body.maskedUrl,
        searchSnippet: body.searchSnippet,
        user: req.decoded.subject
    });

    document.save((err, documentDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'document name already exists'
            });
        }
        res.status(200).json({
            ok: true,
            doc: documentDB
        });
    });
});

app.put('/documents/:id', VerifyToken, (req, res) => {
    Document.findByIdAndUpdate(req.params.id, req.body, (err, document) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            document
        });
    });
});

app.delete('/documents/:id', VerifyToken, (req, res) => {
    Document.findByIdAndRemove(req.params.id, (err, document) => {
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