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
  ]
});

module.exports = mongoose.model("Table",tableSchema);