const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Player = new Schema({
  firstName: {
    required: true,
    type: String
  },
  lastName: {
    required: true,
    type: String
  }
},{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Player', Player);
