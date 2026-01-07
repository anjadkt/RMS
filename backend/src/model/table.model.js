const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber : {
    type :String,
    unique : true,
  },
  qrCode : String,
  tableOrders : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Order"
    }
  ],
  waiterId :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    default : null
  },
  isOccupied : {
    type : Boolean,
    default : false
  },
  restaurentId : String,
  restaurentName : String,
  offers : Array,
  logo : String,
  contactInfo :{
    phone : Number,
    email : String,
    location : String
  }
});

module.exports = mongoose.model("Table",tableSchema);