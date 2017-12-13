var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MTeamSchema = new Schema({
    name: String,
    datebeg: Date,
    dateend: Date,
    members: [{type: Schema.Types.ObjectId, ref:'MPerson'}]
});

module.exports = mongoose.model('MTeam', MTeamSchema);