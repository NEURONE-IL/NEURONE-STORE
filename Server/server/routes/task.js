const express = require("express");
const cors = require('cors');
const Task = require('../models/task');
const VerifyToken = require('../auth/VerifyToken');

const app = express();
app.use(cors());

app.get('/my-tasks', VerifyToken, async(req, res) => {
    await Task.find({ user: req.decoded.subject }, (err, tasks) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            tasks
        });
        return;
    });
});

app.post('/tasks', VerifyToken, (req, res) => {
    let body = req.body;

    let task = new Task({
        name: body.name,
        alias: body.alias,
        code: body.code,
        description: body.description,
        user: req.decoded.subject
    });

    task.save((err, taskDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'document name already exists'
            });
        }
        res.status(200).json({
            ok: true,
            taskDB
        });
    });
});

app.put('/tasks/:id', VerifyToken, (req, res) => {
    Task.findByIdAndUpdate(req.params.id, req.body, (err, task) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            task
        });
    });
});

app.delete('/tasks/:id', VerifyToken, (req, res) => {
    Task.findByIdAndRemove(req.params.id, (err, task) => {
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