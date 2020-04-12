const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let questionnaireSchema = new Schema({
    instructions: {
        type: String,
        required: [true, 'instructions are necessary']
    },
    questionnaireId: {
        type: String,
        required: [true, 'questionnaire id is necessary']
    },
    questions: {
        type: [ObjectId],
        required: [true, 'question(s) is necessary']
    },
    public: {
        type: Boolean,
        required: [true, 'public is required']
    },
    tags: {
        type: [String]
    },
    createdBy: {
        type: ObjectId,
        required: [true, 'user id is necessary']
    }
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);