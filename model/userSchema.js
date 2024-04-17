const mongoose = require('mongoose');
const validator = require('validator')

//model schema
let userSchema = new mongoose.Schema({
    userName: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    password: String,
    tasks: [
        {
            title: String,
            description: String,
            deadline: mongoose.Mixed,
            isDone: Boolean,
        }
    ]
})


module.exports = mongoose.model('User', userSchema)
