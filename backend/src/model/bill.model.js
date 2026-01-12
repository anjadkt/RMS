const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber : {
    type : Number
  },
  billDate : {
    type : Date
  },
  billId : String,
  orderIds : [
    {type : mongoose.Schema.Types.ObjectId,
      ref : "Order"
    }
  ],
  tableNumber : String,
  tableId :  {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Table"
  },
  waiterId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  billItems : Array,
  billTotal : Number,
  paymentStatus : {
    type : String,
    enum : ["prepaid","unpaid","paid","failed","refunded"]
  },
  razorpayOrderId : String,
  paidAmount : Number,
  paidAt : Date,

  qrAmount : Number,
  qrId : String,
  qrImage : String,
  billStatus : {
    type : String,
    enum : ["open","closed","expired"]
  },
  isPrinted : Boolean
});

module.exports = mongoose.model("Bill",billSchema);