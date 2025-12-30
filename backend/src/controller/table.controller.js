const catchAsync = require('../utils/catchAsync.js');
const Table = require('../model/table.model.js');
const Order = require('../model/order.model.js');
const AppError = require('../utils/AppError.js');
const User = require('../model/users.model.js');
const mongoose = require('mongoose');

module.exports = {
  createTable : catchAsync(async(req,res)=>{
    const tableNumber = req.body?.tableNumber
    if(!tableNumber)throw new AppError("Table Number is Required!",400);

    const isTable = await Table.findOne({tableNumber});
    if(isTable)throw new AppError("Table Already Exist!",409)

    const table = await Table.create({
      tableNumber
    });

    if(!table)throw new AppError("Table Creation Failed!",400);
    res.status(201).json({
      message : "table created successfully",
      status : 201,
      table
    });
  }),

  assignTable : catchAsync(async(req,res)=>{

    const {waiterId,tableNumber} = req.body ;

    if(waiterId){
      const user = await User.findOne({_id : waiterId,role: "waiter", isWorking: true});
      if(!user)throw new AppError("valid waiter Id needed!",400);
    }

    if (!tableNumber || (Array.isArray(tableNumber) && !tableNumber.length)) {
      throw new AppError("tableNumber is required", 400);
    }

    if(Array.isArray(tableNumber)){
      const table = await Table.updateMany(
        {tableNumber : {$in : tableNumber}},
        {$set : {waiterId : waiterId ? waiterId : null }});

      if(table.matchedCount === 0)throw new AppError("Updation Failed!",400);

      return res.status(200).json({
        message : `tables ${waiterId ? "assigned" : "removed"}  successfully!`,
        status : 200
      })
    }

    const table = await Table.findOneAndUpdate({tableNumber},{$set : {waiterId}},{new : true});
    if (!table)throw new AppError("Table not found", 404);

    res.status(200).json({
      message : "table assigned successfully!",
      status : 200,
      table
    })
  }),

  getWaiterTable : catchAsync(async(req,res)=>{
    const {_id} = req.user ;
    const {id} = req.params ;

    if(id){
      const table = await Table.findOne({_id : id , waiterId : _id});
      if(!table)throw new AppError("Wrong Table",400);

      const orderIds = table.tableOrders.map(
        id => new mongoose.Types.ObjectId(id)
      );

      const orders = await Order.aggregate([
        {$match : {_id : {$in : orderIds}}},
        {$group : {
          _id : "$customerId",
          orders : {$push : {
            _id : "$_id",
            orderId : "$orderId",
            status : "$status",
            orderItems : "$orderItems",
            isAssisted : "$isAssisted"
          }}
        }}
      ])

      return res.status(200).json({
        message : "Table Found!",
        status : 200,
        orders,
        table
      });
    }

    const tables = await Table.find({waiterId : _id}).populate("tableOrders");
    if(!tables.length)throw new AppError("No Tables Found!",400);

    res.status(200).json({
      message : "Tables Found!",
      status : 200,
      tables
    });
  })
}