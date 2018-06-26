const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
  OauthId: String,
  OauthToken: String,
  email: {
    type: String,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  admin:   {
    type: Boolean,
    select: false,
    default: false
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }
},{
  timestamps: true,
  versionKey: false
});

User.methods.getName = () => {
  return (this.firstName + ' ' + this.lastName);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);