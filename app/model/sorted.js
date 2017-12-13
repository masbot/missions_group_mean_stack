var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SortedSchema = new Schema({
    sort: {type: Boolean, default: false}
});

module.exports = mongoose.model('Sorted', SortedSchema);