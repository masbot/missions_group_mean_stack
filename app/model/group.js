var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GroupSchema = new Schema({
    number: {type: Number, unique:true},
    people: [{type: Schema.Types.ObjectId, ref:'Person'}]
});

module.exports = mongoose.model('Group', GroupSchema);