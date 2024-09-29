const mongoose = require('mongoose');
const { DBURL } = require('./routes/config');
const { MongoDB_URL } = require('./db_url');

mongoose.connect(MongoDB_URL);
console.log("Database connected succesfully")

const userSchema = mongoose.Schema({
    // firstname:{
    //     type: String,
    //     required: true
    // },
    // lastname:{
    //     type: String,
    //     required: true
    // },
    // password:{
    //     type: String,
    //     required: true
    // }
    username: String,
    firstname: String,
    lastname: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);
module.exports = {
    User,
    Account
}
