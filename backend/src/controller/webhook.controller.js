const catchAsync = require('../utils/catchAsync.js');
const Bill = require('../model/bill.model.js');
const mongoose = require('mongoose');
const Order = require('../model/order.model.js');
const Table = require('../model/table.model.js');
const User = require('../model/users.model.js')
const {getIO} = require('../utils/socket.js');
const io = getIO();

module.exports = {

  markPaymentCompleted : catchAsync(async (req,res)=>{
    const event = JSON.parse(req.body.toString());

    if(event.event === "qr_code.credited"){

      const payment = event.payload?.payment?.entity ;

      const bills = await Bill.findOneAndUpdate({
        billId : payment.notes.billId,
        razorpayOrderId : payment.notes.razorpayOrderId,
        paymentStatus: { $nin: ["paid","prepaid"] }
       },
       {
        paymentStatus : "paid",
        paidAmount : payment.amount/100,
        paymentMethod : "upi-qr",
        paidAt : new Date()
       },
       {new : true});

      if (!bills) {
        console.log("⚠️ Bill not found or already processed");
        return res.status(200).json({ ignored: true });
      }

      const orderObjectIds = bills?.orderIds.map(
        id => new mongoose.Types.ObjectId(id)
      );
      
      await Order.updateMany(
        {_id : {$in : orderObjectIds},paymentStatus : {$ne : "prepaid"}},
        {status : "completed",paymentStatus : "paid",billId : bills._id},
        {runValidators : true}
      );

      await Order.updateMany(
        {_id : {$in : orderObjectIds},paymentStatus : "prepaid"},
        {status : "completed",billId : bills._id},
        {runValidators : true}
      );

      for(let v of bills.tableId){
        const table = await Table.findOneAndUpdate({_id : v},{$pull : {tableOrders : {$in : orderObjectIds}}},{new : true});

        if(table && table.tableOrders.length === 0){
          table.isOccupied = false ;
          await table.save();
        }
      }

      res.status(200).json({ received: true });
      
    }

    if(event.event === "payment.captured"){
      const payment = event.payload?.payment?.entity ;

      const razorpayOrderId = payment.order_id;
      const paymentId = payment.id;

      const order = await Order.findOneAndUpdate(
        {razorpayOrderId , paymentStatus : {$nin : ["prepaid","billed","paid"]}},
        {paidAmount :payment.amount/100 , razorpayPaymentId : paymentId , paymentStatus : "prepaid",paidAt : new Date(),status : "accepted"},
        {new : true , runValidators : true}
      );

      if(!order){
        console.log("⚠️ Bill not found or already processed");
        return res.status(200).json({ ignored: true });
      }

      await Table.updateOne({_id : order.tableId},{$push : {tableOrders : order._id},isOccupied : true},{runValidators : true});
      await User.updateOne({_id : order.customerId},{$push : {orders : order._id}, $set : {cart : []}},{runValidators : true});

      io.to(`cook`).emit('order-accepted',{order});

      res.status(200).json({ received: true });
    }

    if(event.event === "payment.failed"){
      const payment = event.payload.payment.entity;
      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { paymentStatus: "failed" }
      );
      res.json({ success: true });
    }

  })

}