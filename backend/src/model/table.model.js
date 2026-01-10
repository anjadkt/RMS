const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber : {
    type :String,
    unique : true,
  },
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
  restaurentTimes : String,
  offers : [
    {
      offer : String,
      product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Item"
      },
      title : String,
      isMain : Boolean
    }
  ],
  logo : String,
  phone : Number,
  email : String,
  location : String,
  status : String,
  categories : [
    {
      img : String,
      name : String
    }
  ]
});

module.exports = mongoose.model("Table",tableSchema);