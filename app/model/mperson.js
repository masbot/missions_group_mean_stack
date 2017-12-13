var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MPersonSchema = new Schema({
    name: String,
    gender: String,
    campus: String,
    type: String,
    skill: String,
    personality: String,
    experience: Number,
    vacationbeg: Date,
    vacationend: Date,
    citizenship: String,
    select: {type: Boolean, default: false},
    preference1: String,
    preference2: String
});

module.exports = mongoose.model('MPerson', MPersonSchema);