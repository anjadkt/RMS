const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber : String,
  isOccupied : Boolean,
  tableOrders : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Order"
    }
  ]
});

module.exports = mongoose.model("Table",tableSchema);