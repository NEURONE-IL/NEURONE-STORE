const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let stageSchema = new Schema({
    id: {
        type: String,
        required: [true, 'id is necessary']
    },
    time: {
        type: Number,
        required: [true, 'time id is necessary']
    },
    user: {
        type: ObjectId,
        required: [true, 'user id is necessary']
    },
    type: {
        type: String,
        required: [true, 'type is necessary']
    },
    state: {
        type: String,
        required: [true, 'state is necessary']
    }
}, { strict: false });

stageSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

module.exports = mongoose.model('Stage', stageSchema);