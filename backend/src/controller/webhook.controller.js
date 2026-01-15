const catchAsync = require('../utils/catchAsync.js');
const Bill = require('../model/bill.model.js');
const mongoose = require('mongoose');
const Order = require('../model/order.model.js');
const Table = require('../model/table.model.js');

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
        {_id : {$in : orderObjectIds}},
        {status : "completed",paymentStatus : "paid",billId : bills._id},
        {runValidators : true}
      );

      const table = await Table.findOneAndUpdate({_id : bills.tableId},{$pull : {tableOrders : {$in : orderObjectIds}}},{new : true});

      if(table && table.tableOrders.length === 0){
        table.isOccupied = false ;
        await table.save();
      }

      res.status(200).json({ received: true });
      
    }
  })
}