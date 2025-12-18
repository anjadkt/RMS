const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone : Number,
  otp :String,
  expiresAt : {
    type :Date,
    expires : 300
  }
});

module.exports = mongoose.model("Otp",otpSchema);