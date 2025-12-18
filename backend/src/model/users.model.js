const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name : String,

  email : String,
  phone : {
    type :Number
  },
  staffId : String,

  password : String,
  pin : Number,

  role : {
    type : String,
    enum : ["customer","waiter","cook","admin"]
  },

  isBanned : {
    type : Boolean,
    default : false
  },
  isWorking : Boolean,
  login : {
    type : Boolean,
    default : false
  },

  cart : Array,
  orders : Array,
  notification : Array,
  tables : Array,

  refreshToken: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("User",userSchema);