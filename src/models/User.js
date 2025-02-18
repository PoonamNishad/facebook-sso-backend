const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  facebookId: { type: String, required: false, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String },
  access_token:  { type: String },
  password: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
