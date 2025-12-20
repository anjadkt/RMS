const catchAsync = require('../utils/catchAsync.js');
const Table = require('../model/table.model.js');
const AppError = require('../utils/AppError.js');

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

    if(Array.isArray(tableNumber)){

    }

    const table = await Table.findOne({tableNumber});
    if(table.waiterId){
      throw new AppError("Waiter already Assinged!",409);
    }else{
      table.waiterId = waiterId
      await table.save();
    }

    res.status(200).json({
      message : "table assigned successfully!",
      status : 200,
      table
    })
  }),
  getWaiterTable : catchAsync(async(req,res)=>{

  })
}