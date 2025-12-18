const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name : String,

  email : String,
  phone : {
    type :Number,
    unique : true
  },
  staffId : String,

  password : String,
  pin : String,

  role : {
    type : String,
    enum : ["customer","waiter","cook","admin"]
  },
  details :Object,

  isBanned : {
    type : Boolean,
    default : false
  },
  isWorking : Boolean,
  login : {
    type : Boolean,
    default : false
  },

  cart : [
      {
        item : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Item"
          },
        quantity : {
          type :Number,
          default : 1
        }
      }
  ],
  orders : Array,
  notification : Array,
  tables : Array,

  refreshToken: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("User",userSchema);