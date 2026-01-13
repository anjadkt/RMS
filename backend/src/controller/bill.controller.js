const catchAsync = require('../utils/catchAsync.js');
const Bill = require('../model/bill.model.js');
const Table = require('../model/table.model.js');
const AppError = require('../utils/AppError.js');

module.exports = {
  getBills : catchAsync(async (req,res)=>{
    const {role,_id} = req.user ;
    const {tableId,paymentStatus} = req.body ;

    if(!["unpaid","paid"].includes(paymentStatus))throw new AppError("invalid Payment Status",400);

    const query = {
      paymentStatus
    }

    if(tableId){
      const table = await Table.findOne({_id : tableId});
      if(!table)throw new AppError("Valid Table ID Needed",400);
      query.tableId = tableId
    }

    if(role === "waiter"){
      query.waiterId = _id
    }

    const bills = await Bill.find(query);
    if(!bills)throw new AppError("No bills Found!",404);
    res.status(200).json(bills);
  })
}