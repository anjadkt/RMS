const mongoose = require('mongoose');



const orderSchema = new mongoose.Schema({
  orderId :String,
  orderType : {
    type : String,
    enum : ["Dine-in","Take-away"]
  },
  tableNumber:String,
  customerId:{
     type : mongoose.Schema.Types.ObjectId,
     ref : "User"
  },
  status : {
    type :String,
    enum : ["placed","accepted","preparing","ready","served","completed"]
  },
  orderItems : [
    {
      item : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Item"
      },
      quantity : Number
    }
  ]
});

module.exports = mongoose.model("Order",orderSchema);