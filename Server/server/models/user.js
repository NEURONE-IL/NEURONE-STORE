const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;


let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is necessary']
    },
    institution: {
        type: String,
        required: [true, 'institution is necessary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is necessary']
    },
    password: {
        type: String,
        required: [true, 'password is necessary']
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

module.exports = mongoose.model('User', userSchema);