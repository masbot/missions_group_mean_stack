var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PersonSchema = new Schema({
    name: String,
    gender: String,
    campus: String,
    type: String,
    select: {type: Boolean, default: false}
});

module.exports = mongoose.model('Person', PersonSchema);