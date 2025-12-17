const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name : String,

  email : String,
  phone : Number,
  staffId : String,

  password : String,
  pin : Number,

  role : {
    type : String,
    enum : ["customer","waiter","cook","admin"]
  },

  isBanned : Boolean,
  isWorking : Boolean,

  cart : Array,
  orders : Array,
  notification : Array,
  tables : Array
});

module.exports = mongoose.model("User",userSchema);