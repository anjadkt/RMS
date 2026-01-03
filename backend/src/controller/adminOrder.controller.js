const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');
const Order = require('../model/order.model.js');
const Table = require('../model/table.model.js');

module.exports = {
  getOrderData : catchAsync(async(req,res)=>{
    const today = new Date().toISOString().slice(0, 10);

    const total = await Order.aggregate([
      {$match : {orderDate : today,status : "completed"}},
      {$group : {
        _id : null ,
        total : {$sum : "$orderTotal"}
      }}
    ]);

    const allOrdersToday = await Order.find({orderDate : today}).countDocuments();

    const orderCount = await Order.aggregate([
      {$match : {status : {$nin : ["completed"]}}},
      {$group : {
        _id : "$status",
        orderCount : {$sum : 1}
      }}
    ])

    const pending = await Order.aggregate([
      {$match : {status : "pending"}},
      {$group : {
        _id : null ,
        total : {$sum : "$orderTotal"}
      }}
    ]);

    const incoming = await Order.aggregate([
      {$match : {status : {$nin : ["pending","completed"]}}},
      {$group : {
        _id : null ,
        total : {$sum : "$orderTotal"}
      }}
    ]);

    const tables = await Table.aggregate([
      {$group : {
        _id : "$isOccupied",
        count : {$sum : 1}
      }}
    ]);

    const totalTable = await Table.countDocuments();

    res.status(200).json({
     totalToday : total[0]?.total || 0 ,
     pendingToday : pending[0]?.total || 0 ,
     progressToday : incoming[0]?.total || 0,
     orderCountToday : orderCount,
     allOrdersCount : allOrdersToday,
     currentTables : tables,
     totalTableCount : totalTable

    })
  })
}