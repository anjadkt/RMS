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
  })
}