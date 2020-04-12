const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let publishSchema = new Schema({
    // password: {
    //     type: String,
    //     required: [true, 'password is required']
    // },
    user: {
        type: ObjectId,
        required: [true, 'user is required']
    }
}, { strict: false });


module.exports = mongoose.model('Publish', publishSchema);