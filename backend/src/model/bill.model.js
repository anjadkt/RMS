const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber : {
    type : Number
  },
  billDate : {
    type : String
  },
  billId : String,
  orderIds : [
    {type : mongoose.Schema.Types.ObjectId,
      ref : "Order"
    }
  ],
  tableNumber : String,
  tableId :  [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Table"
  }],
  waiterId : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  }],
  billItems : Array,
  billTotal : Number,
  paidTotal : Number,
  paymentLeft : Number,
  paymentStatus : {
    type : String,
    enum : ["prepaid","billed","unpaid","paid","failed","refunded"]
  },
  paymentMethod : {
    type :String,
    enum : ["upi","upi-qr","in-hand"]
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
  isPrinted : Boolean,
  restaurentName : String,
  location : String
},{timestamps:true});

billSchema.index({billNumber : -1 ,createdAt : -1})

module.exports = mongoose.model("Bill",billSchema);