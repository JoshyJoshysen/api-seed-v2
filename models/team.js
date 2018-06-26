const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Team = new Schema({
  //createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  name: {
    required: true,
    type: String
  },
  country: String,
  league: Number,
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player'
  }]
},{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Team', Team);
