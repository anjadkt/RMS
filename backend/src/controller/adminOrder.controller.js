const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');
const Order = require('../model/order.model.js');
const Table = require('../model/table.model.js');

module.exports = {
  getDashboardData : catchAsync(async(req,res)=>{
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
  }),

  getOrders : catchAsync(async (req,res)=>{
    //f=filter s=status q=search
    const {s,f,q,t} = req.query;

    const today = new Date().toISOString().slice(0, 10);

    if(!["all","placed","accepted","preparing","ready","served","pending","completed"].includes(s))throw new AppError(s + " Not Allowed!",400);

    if(!["customers","waiters","tables","none"].includes(f))throw new AppError(f + " Not Allowed!",400);

    const query = {
      status : s
    }

    if(t==="true"){
      query.orderDate = today
    }

    if(s === "all"){
      query.status = {$in : ["accepted","preparing","placed","accepted","preparing","ready","served","pending","completed"]}
    }

    if(q?.trim()){
      query.orderId = {$regex : q.trim() , $options : "i"}
    }

    const orders = await Order.find(query).sort({orderId : -1}).populate("waiterId");
    res.status(200).json(orders);
  }),

  changeOrderStatus : catchAsync(async (req,res)=>{
    const {status,id,tableId} = req.body ;
    if(!["cancel","placed","accepted","preparing","ready","served","pending","completed"].includes(status)){
      throw new AppError(status +"Not Allowed!",400);
    }

    if(status === "cancel"){
      await Order.deleteOne({_id : id});
      const update = await Table.findOneAndUpdate({_id : tableId},{ $pull : {tableOrders : id}});
      return res.status(200).json({
        message : "Order"+status,
        status : 200
      });
    }

    if(status === "completed"){
      const update = await Table.findOneAndUpdate({_id : tableId},{ $pull : {tableOrders : id}});
    }

    const update = await Order.findOneAndUpdate({_id : id},{status},{runValidators : true,new : true});
    if(!update)throw new AppError("Update Failed!",400);

    res.status(200).json(update);

  }),
}