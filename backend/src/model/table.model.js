const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber : {
    type :String,
    unique : true,
    require : true
  },
  tableOrders : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Order"
    }
  ],
  waiterId :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  }
});

module.exports = mongoose.model("Table",tableSchema);