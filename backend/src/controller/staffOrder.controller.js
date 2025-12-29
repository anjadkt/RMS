const catchAsync = require('../utils/catchAsync.js');
const Table = require('../model/table.model.js');
const Order = require('../model/order.model.js');
const AppError = require('../utils/AppError.js');
const mongoose = require('mongoose');

async function getOrderId(){
  const today = new Date().toISOString().slice(0, 10);
  const todayString = today.split("-").join("");

  const order = await Order.aggregate([
    {$match :{orderDate : today}},
    {$sort : {orderNumber : -1}},
    {$limit : 1}
  ])

  const orderNumber =  order[0] ? order[0].orderNumber + 1 : 1 ;
  const orderId = `ODR-${todayString}-${orderNumber}`

  return {orderNumber,orderId,orderDate : today}
}

module.exports = {
  
  getChefOrders : catchAsync(async (req,res)=>{
    const today = new Date().toISOString().slice(0, 10);
    const {status} = req.params ;
    if(!["accepted","preparing","ready"].includes(status))throw new AppError(status + " Not Allowed!",400);
    const orders = await Order.find({status}).sort({orderNumber : status === "accepted" ? -1 : 1});
    res.status(200).json(orders);
  }),

  getWaiterOrders : catchAsync(async (req,res)=>{
    const {_id} = req.user ;
    const {s} = req.query ;

    if(s && !["placed","accepted","preparing","ready","served","pending","completed"].includes(s))throw new AppError("Wrong Query!",400);

    // const table = await Table.aggregate([
    //   {$match : {waiterId : _id}}
    // ])
    // if(!table)throw new AppError("No Orders Found!",404);

    const table = await Table.find({waiterId : _id}).select("tableOrders");
    if(!table.length)throw new AppError("No Tables Found!",404);

    const tableIds = table.flatMap(t => t.tableOrders );

    if(!tableIds.length)throw new AppError("No Orders Found!",404);

    const orderQuery = {
      _id : {$in : tableIds}
    }

    if(s){
      orderQuery.status = s
    }

    const orders = await Order.find(orderQuery).sort({orderNumber : -1});

    res.status(200).json({
      message : "send all current orders!",
      status :200,
      orders
    });
  }),

  confirmOrder : catchAsync(async (req,res)=>{
    const {_id} = req.user ;
    const {id,tableId,action} = req.body ;

    if(!["accepted","served"].includes(action))throw new AppError(action + " not a proper status!",400);

    const table = await Table.findOne({_id : tableId});
    if(!table)throw new AppError("Order Not Found",404);
    if(table.waiterId?.toString() !== _id)throw new AppError("Waiter and Order doesn't match!",409);

    const order = await Order.findOneAndUpdate(
      {_id : id,status : action === "accepted" ? "placed" : "ready"},
      {status : action},
      {new : true, runValidators : true }
    );
    if(!order)throw new AppError("Order Cannot be Accepted / already Accepted!",400);

    //notify chef

    res.status(200).json({
      message : `Order ${action} Successfully!`,
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
  }),

  genBill : catchAsync(async (req,res)=>{

    const {orderIds,tableId} = req.body ;

    if (!Array.isArray(orderIds) || orderIds.length === 0 || !tableId)throw new AppError("fields required", 400);

    const orderObjectIds = orderIds.map(
      id => new mongoose.Types.ObjectId(id)
    );

    const table = await Table.findOne({_id : new mongoose.Types.ObjectId(tableId) , tableOrders: { $all: orderObjectIds } });
    if(!table)throw new AppError("orders should from same table!",400);

    const orders = await Order.find({_id : {$in : orderIds}});
    const orderItemsObj = {}
    let orderBillId = ""

    for(let order of orders){
      for(let v of order?.orderItems){
        if(!orderItemsObj[v.itemId]){
          orderItemsObj[v.itemId] = {
            name : v.name,
            quantity : v.quantity,
            subTotal : v.price * v.quantity,
            price : v.price
          }
        }else{
          orderItemsObj[v.itemId].quantity += v.quantity ;
          orderItemsObj[v.itemId].subTotal = orderItemsObj[v.itemId].quantity * v.price ;
        }
      }
      orderBillId += (order.orderId + " | ");
    }

    const grandTotal = Object.values(orderItemsObj).reduce((acc,val)=>acc+val.subTotal,0);
    
    return res.status(201).json({
      message : "bill generated for " + orderBillId,
      status : 201,
      restaurantInfo : {
        name : "paragon",
        address : "manjeri,malappuram",
      },
      billInfo : {
        date : new Date().toISOString().split("T")[0],
        orderNumbers : orderBillId,
        gstn : "32PQRSX5678L1Z2",
        paymentStatus : "",
        tableNumber : table.tableNumber,
        billId : "BILL-" + Date.now()
      },
      orderDetails : Object.values(orderItemsObj),
      billSummary :{
        total : grandTotal
      }

    });
  }),

  orderPayment : catchAsync(async (req,res)=>{
    const {action,orderIds,tableId} = req.body ;

    if (!Array.isArray(orderIds) || orderIds.length === 0 || !tableId)throw new AppError("fields required", 400);

    const orderObjectIds = orderIds.map(
      id => new mongoose.Types.ObjectId(id)
    );

    const table = await Table.findOne({_id : new mongoose.Types.ObjectId(tableId) , tableOrders: { $all: orderObjectIds } });
    if(!table)throw new AppError("orders should from same table!",400);

    if(!["paynow","paylater"].includes(action))throw new AppError(action + " not a proper status!",400);

    if(action === "paylater"){
      const update = await Order.updateMany(
        {_id : {$in : orderIds},status : "served"},
        {status : "pending"},
        {runValidators : true}
      );

      if (update.modifiedCount !== orderIds.length) {
        throw new AppError("Some orders were not updated", 400);
      }
      return res.status(200).json({
        message : "PayLater Alloted and Changed order status to pending..",
        status : 200
      })
    }

    if(action === "paynow"){

    }

  })

}