
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
require('./config/config');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/user'));
app.use(require('./routes/question'));
app.use(require('./routes/synthesis'));
app.use(require('./routes/questionnaire'));
app.use(require('./routes/document'));
app.use(require('./routes/locale'));
app.use(require('./routes/domain'));
app.use(require('./routes/task'));
app.use(require('./routes/upload'));
app.use(require('./routes/stage'));
app.use(require('./routes/study'));
app.use(require('./routes/publish'));
app.use('/static', express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("Database online");
});


const server = app.listen(process.env.PORT, () => {
    console.log(`Server initialized at port ${process.env.PORT}`);
});

server.timeout = 60000;

// Export our app for testing purposes
module.exports = app;