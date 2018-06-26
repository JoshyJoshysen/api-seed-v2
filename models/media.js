const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Media = new Schema({
  gridfsId: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  mimetype: String,
  filename: String,
  originalname: String,
  type: String,
  metaData: {},
  url: String
},{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Media', Media);
