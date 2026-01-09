const mongoose = require('mongoose');



const orderSchema = new mongoose.Schema({
  orderId :{
    type :String,
    required : true
  },
  orderType : {
    type : String,
    enum : ["Dine-in","Take-away"]
  },
  tableNumber:String,
  tableId :{
    type :mongoose.Schema.Types.ObjectId,
    ref : "Table"
  },
  customerId:{
     type : mongoose.Schema.Types.ObjectId,
     ref : "User"
  },
  waiterId:{
     type : mongoose.Schema.Types.ObjectId,
     ref : "User"
  },
  customerName :String,
  status : {
    type :String,
    enum : ["placed","accepted","preparing","ready","served","pending","completed"]
  },
  orderItems :[
    {
      itemId : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "Item"
      },
      name : String,
      price : Number,
      image : String,
      category : String,
      quantity : Number,
      subTotal : Number
    }
  ],
  instructions:String,
  orderNumber :{
    type : Number
  },
  orderDate : {
    type :String,
    require : true
  },
  isAssisted : {
    type :Boolean,
    default : false
  },
  orderTotal : Number,
  prepareTime : {
    type : Date
  },
  createdAt : {
    type : Date
  }
});


module.exports = mongoose.model("Order",orderSchema);