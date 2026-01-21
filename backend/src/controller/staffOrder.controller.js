const catchAsync = require('../utils/catchAsync.js');
const Table = require('../model/table.model.js');
const Order = require('../model/order.model.js');
const Bill = require('../model/bill.model.js');
const AppError = require('../utils/AppError.js');
const User = require('../model/users.model.js');
const mongoose = require('mongoose');
const razorpay = require('../utils/razorPay.js');
const {getIO} = require('../utils/socket.js');
const io = getIO();


async function getBillId(){
  const today = new Date().toISOString().slice(0, 10);
  const todayString = today.split("-").join("");

  const bill = await Bill.aggregate([
    {$match : {billDate : today}},
    {$sort : {billNumber : -1}},
    {$limit : 1}
  ])

  const billNumber =  bill[0] ? bill[0].billNumber + 1 : 1 ;
  const billId = `BILL-${todayString}-${billNumber}`

  return {billNumber,billId,billDate : today}
}

async function computeOrder(orderIds){
  const orders = await Order.find({_id : {$in : orderIds}});
  const orderItemsObj = {}
  let orderBillId = ""

  let paidTotal = 0 ;
  for(let order of orders){
    if(order.paymentStatus === "prepaid"){
      paidTotal += order.paidAmount ;
    }
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
  const grandTotal = orders.reduce((acc,val)=>acc+val.orderTotal,0);

  return {orderDetails : Object.values(orderItemsObj),orderBillId,TOTAL : grandTotal , paidTotal , paymentLeft : grandTotal - paidTotal}
}

module.exports = {
  
  getChefOrders : catchAsync(async (req,res)=>{
    const {status} = req.params ;

    if(!["accepted","preparing","ready","all"].includes(status))throw new AppError(status + " Not Allowed!",400);

    const query = {
      status
    }

    if(status === "all"){
      query.status = {$in : ["accepted","preparing","ready"]}
    }

    const orders = await Order.find(query).sort({orderId : 1, orderNumber : 1});
    res.status(200).json(orders);
  }),

  getWaiterOrders : catchAsync(async (req,res)=>{
    const {_id} = req.user ;
    const {s} = req.query ;

    if(s && !["placed","accepted","preparing","ready","served","pending","completed"].includes(s))throw new AppError("Wrong Query!",400);

    if(s==="completed"){
      const today = new Date().toISOString().slice(0, 10);
      const orders = await Order.find({waiterId : _id , orderDate :today ,status : "completed"}).sort({orderDate : -1,orderNumber : -1});
      return res.status(200).json({
        message : "send all current orders!",
        status :200,
        orders
      });
    }

    // const table = await Table.aggregate([
    //   {$match : {waiterId : _id}}
    // ])
    // if(!table)throw new AppError("No Orders Found!",404);

    const table = await Table.find({waiterId : _id}).select("tableOrders");
    if(!table.length)throw new AppError("No Tables Found!",404);

    const tableIds = table.flatMap(t => t.tableOrders );

    if(!tableIds.length){
      return res.status(200).json({orders :[]});
    }

    const orderQuery = {
      _id : {$in : tableIds},
      status : {$nin : ["completed","initiated"]}
    }

    if(s){
      orderQuery.status = s
    }

    const orders = await Order.find(orderQuery).sort({orderDate : -1,orderNumber : -1});

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

    if(order.status === "accepted"){
      io.to(`cook`).emit('order-accepted',{order});
    }

    res.status(200).json({
      message : `Order ${action} Successfully!`,
      order,
      status : 200
    });
  }),

  prepareOrder : catchAsync(async (req,res)=>{
    const {action , id} = req.body ;

    if(!["accepted","preparing"].includes(action))throw new AppError(action + " is Not a Status!",400);
    
    const order = await Order.findOneAndUpdate(
      {_id : id },
      {status : action === "accepted" ? "preparing" : "ready"},
      {new : true , runValidators : true}
    );
    if(!order)throw new AppError("Order Updation Failed!",400);

    if(order.customerId ){
      const notiData = {
        from : "kitchen",
        message : order.status === "preparing" ? 
          `🔥 We’ve started preparing your order. ID:${order.orderId.slice(-7)}..` :
          `🍽️ Your order (ID: ${order.orderId}) is ready`,
        link : process.env.USERFRONT_END_URL + "/history"
      }
      await User.findOneAndUpdate({_id : order.customerId },{$push : {notification : notiData}});
      io.to(order.customerId?.toString()).emit('new-noti',{notiData});
    }

    if(order.status === "ready"){
      io.to(order.waiterId?.toString()).emit('order-ready',{order});
    }

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

    const orderItemsObj = await computeOrder(orderObjectIds);

    const billObj = await getBillId();

    const resto = await Table.findOne({restaurentId : "REST-20251221-XGQIW9"});
    
    return res.status(201).json({
      message : "bill generated for " + orderItemsObj.orderBillId,
      status : 201,
      billData :{
        restaurentName : resto.restaurentName,
        location : resto.location,
        gstn : "32PQRSX5678L1Z2",
        date : billObj.billDate,
        orderNumbers : orderItemsObj.orderBillId,
        paymentStatus : "unpaid",
        tableNumber : table.tableNumber,
        tableId : table._id,
        billId : billObj.billId,
        billItems : orderItemsObj.orderDetails,
        billNumber : billObj.billNumber,
        billTotal : orderItemsObj.TOTAL,
        paidTotal : orderItemsObj.paidTotal ,
        paymentLeft : orderItemsObj.paymentLeft
      }

    });
  }),

  orderPayment : catchAsync(async (req,res)=>{
    const {orderIds} = req.body ;

    if (!Array.isArray(orderIds) || orderIds.length === 0)throw new AppError("fields required", 400);

    const orderObjectIds = orderIds.map(
      id => new mongoose.Types.ObjectId(id._id)
    );

    const existingBill = await Bill.findOne({
      orderIds: { $in : orderObjectIds }
    }).lean();

    if (existingBill) {
      return res.status(200).json({
        message : "Bill Already generated",
        status : 200,
        billData : {
          ...existingBill,
          created : true
        }
      });
    }

    const tableNumbers = []
    const tableIds = []
    const waiterIds = []

    for(let v of orderIds){
      if(!tableNumbers.includes(v.tableNumber)){
        tableNumbers.push(v.tableNumber);
        tableIds.push(v.tableId);
      }
      if(!waiterIds.includes(v.waiterId)){
        waiterIds.push(v.waiterId);
      }
    }


    // const table = await Table.findOne({_id : new mongoose.Types.ObjectId(tableId) , tableOrders: { $all: orderObjectIds } });
    // if(!table)throw new AppError("orders should from same table!",400);

    const orderItemsObj = await computeOrder(orderObjectIds);

    if (!orderItemsObj?.TOTAL || orderItemsObj.TOTAL <= 0) {
      throw new AppError("Invalid bill amount", 400);
    }

    const billObj = await getBillId();

    const resto = await Table.findOne({restaurentId : "REST-20251221-XGQIW9"});

    try {
      let order;
      let qr ;
      
      if(orderItemsObj.paymentLeft){
        order = await razorpay.orders.create({
          amount : orderItemsObj.paymentLeft * 100,
          currency: "INR",
          receipt: `bill_${billObj.billId}`
        });
        qr = await razorpay.qrCode.create({
          type: "upi_qr",
          name: `Bill #${orderItemsObj.orderBillId}`,
          usage: "single_use",
          fixed_amount: true,
          payment_amount: orderItemsObj.paymentLeft * 100,
          description: `Payment for Bill ${billObj.billId}`,
          close_by: Math.floor(Date.now() / 1000) + 30 * 60,
          notes: {
            billId: billObj.billId,
            razorpayOrderId: order.id
          }
        });
      }

      const bills = await Bill.create({
        billNumber : billObj.billNumber,
        billDate : billObj.billDate,
        billId : billObj.billId,
        orderIds,
        tableNumber : tableNumbers.join("|"),
        tableId : tableIds,
        waiterId : waiterIds,
        billItems : orderItemsObj.orderDetails,
        billTotal : orderItemsObj.TOTAL,
        paidTotal : orderItemsObj.paidTotal ,
        paymentLeft : orderItemsObj.paymentLeft,
        paymentStatus : orderItemsObj.paymentLeft ? "billed" : "paid",
        razorpayOrderId : orderItemsObj.paymentLeft ? order.id : null,
        qrId : orderItemsObj.paymentLeft ? qr.id : null,
        qrAmount : orderItemsObj.paymentLeft ? qr.amount : null,
        qrImage : orderItemsObj.paymentLeft ? qr.image_url : null,
        restaurentName : resto.restaurentName,
        location : resto.location
      });

      await Order.updateMany(
        {_id : {$in : orderObjectIds}, paymentStatus : {$ne : "prepaid"}},
        {status : "pending",billId : bills._id,paymentStatus : "billed"},
        {runValidators : true}
      );

      await Order.updateMany(
        {_id : {$in : orderObjectIds}, paymentStatus : "prepaid"},
        {status : "completed",billId : bills._id},
        {runValidators : true}
      );

      if(!orderItemsObj.paymentLeft){
        for(let v of tableIds){
          const table = await Table.findOneAndUpdate({_id : v},{$pull : {tableOrders : {$in : orderObjectIds}}},{new : true});

          if(table && table.tableOrders.length === 0){
            table.isOccupied = false ;
            await table.save();
          }
        }
      }

      // if (update.modifiedCount !== orderIds.length) {
      //   throw new AppError("Some orders were not updated", 400);
      // }
  
      res.status(200).json({
        message : "Bill generated and Changed order status to pending..",
        status : 200,
        billData : bills
      });

    } catch (error) {
      console.error("RAZORPAY QR ERROR:", error);
      throw new AppError(error.description || "QR Generation Failed", 400);
    }
  })

}