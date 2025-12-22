const catchAsync = require('../utils/catchAsync.js');
const Table = require('../model/table.model.js');
const Order = require('../model/order.model.js');
const AppError = require('../utils/AppError.js')

module.exports = {
  getWaiterOrders : catchAsync(async (req,res)=>{
    const {_id} = req.user ;

    const table = await Table.find({waiterId : _id}).populate("tableOrders");
    if(!table)throw new AppError("No Orders Found!",404);

    res.status(200).json({
      message : "send all current orders!",
      status :200,
      orders : table
    });
  }),

  confirmOrder : catchAsync(async (req,res)=>{
    const {_id} = req.user ;
    const {id,tableId} = req.body ;

    const table = await Table.findOne({_id : tableId});
    if(!table)throw new AppError("Order Not Found",404);
    if(table.waiterId?.toString() !== _id)throw new AppError("Waiter and Order doesn't match!",409);

    const order = await Order.findOneAndUpdate({_id : id,status : "placed"},{status : "accepted"},{new : true, runValidators : true });
    if(!order)throw new AppError("Order Cannot be Accepted / already Accepted!",400);

    //notify chef

    res.status(200).json({
      message : "Order Confirmed Successfully!",
      order,
      status : 200
    });
  }),

  prepareOrder : catchAsync(async (req,res)=>{
    const {action , id} = req.body ;

    if(!["preparing","ready"].includes(action))throw new AppError(action + " is Not a Status!",400);
    
    const order = await Order.findOneAndUpdate(
      {_id : id , status : action === "preparing" ? "accepted" : "preparing"  },
      {status : action},
      {new : true , runValidators : true}
    );
    if(!order)throw new AppError("Order Updation Failed!",400);

    //update waiter

    res.status(200).json({
      message : "Order status updated to " + action ,
      status : 200,
      order
    })
  })
}