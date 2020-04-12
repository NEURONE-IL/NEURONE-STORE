const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let localeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is necessary']
    },
    alias: {
        type: String,
        required: [true, 'alias is necessary']
    },
    code: {
        type: String,
        required: [true, 'code is necessary']
    },
    user: {
        type: ObjectId,
        required: [true, 'user id is necessary']
    }
});

module.exports = mongoose.model('Locale', localeSchema);