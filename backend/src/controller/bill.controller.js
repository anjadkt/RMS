const catchAsync = require('../utils/catchAsync.js');
const Bill = require('../model/bill.model.js');
const Table = require('../model/table.model.js');
const User = require('../model/users.model.js');
const Order = require('../model/order.model.js');
const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError.js');
const mongoose = require('mongoose');

module.exports = {
  getBills : catchAsync(async (req,res)=>{
    const {role,_id} = req.user ;
    const {tableId,paymentStatus,todays,q} = req.body ;
    const today = new Date().toISOString().slice(0, 10);

    if(!["unpaid","paid","all","prepaid"].includes(paymentStatus))throw new AppError("invalid Payment Status",400);

    const query = {}

    if(q?.trim()){
      query.billId = {$regex : q , $options : "i"}
    }

    if(todays || paymentStatus === "paid" || paymentStatus === "all"){
      query.billDate = today ;
    }

    if(paymentStatus !== "all"){
      query.paymentStatus = paymentStatus ;
    }

    if(tableId){
      const table = await Table.findOne({_id : tableId});
      if(!table)throw new AppError("Valid Table ID Needed",400);
      query.tableId = tableId
    }

    if(role === "waiter"){
      query.waiterId = _id
    }

    const bills = await Bill.find(query).sort({billNumber : -1})
    if(!bills)throw new AppError("No bills Found!",404);
    res.status(200).json(bills);
  }),

  completeBill : catchAsync(async (req,res)=>{
    const {_id} = req.user ;
    const {id,password,paymentMethod ,orderIds} = req.body ;

    console.log(req.body);

    if(!["upi","upi-qr","in-hand"].includes(paymentMethod))throw new AppError("Method Not allowed!",400);

    const user = await User.findOne({_id});
    const isMatched = await bcrypt.compare(password,user.password);
    if(!isMatched)throw new AppError("Admin Not verified!",400);

    const bills = await Bill.findOneAndUpdate({
      _id : new mongoose.Types.ObjectId(id),
      paymentStatus: { $nin: ["paid","prepaid"] }
    },
    {
      paymentStatus : "paid",
      paymentMethod,
      paidAt : new Date()
    },
    {new : true});

    if (!bills)throw new AppError("Bill already/pre Paid!",404);

    bills.paymentAmount = bills.billTotal ;
    await bills.save();

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

    res.status(200).json(bills);
  })
}