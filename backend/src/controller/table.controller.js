const catchAsync = require('../utils/catchAsync.js');
const Table = require('../model/table.model.js');
const AppError = require('../utils/AppError.js');
const User = require('../model/users.model.js');

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
      const user = await User.findOne({_id : waiterId});
      if(!user)throw new AppError("valid User Id needed!",400);
    }

    if (!tableNumber || (Array.isArray(tableNumber) && !tableNumber.length)) {
      throw new AppError("tableNumber is required", 400);
    }

    if(Array.isArray(tableNumber)){
      const table = await Table.updateMany(
        {tableNumber : {$in : tableNumber}},
        {$set : {waiterId : waiterId ? waiterId : null }});

      if(!table.modifiedCount)throw new AppError("Updation Failed!",400);

      return res.status(200).json({
        message : `tables ${waiterId ? "assigned" : "removed"}  successfully!`,
        status : 200
      })
    }

    const table = await Table.findOneAndUpdate({tableNumber},{$set : {waiterId}},{new : true});

    res.status(200).json({
      message : "table assigned successfully!",
      status : 200,
      table
    })
  }),
  getWaiterTable : catchAsync(async(req,res)=>{

  })
}