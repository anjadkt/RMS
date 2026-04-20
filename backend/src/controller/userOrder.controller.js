const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');
const User = require('../model/users.model.js');
const Order = require('../model/order.model.js');
const Table = require('../model/table.model.js');
const razorpay = require('../utils/razorPay.js');

const {getIO} = require('../utils/socket.js');
const io = getIO();

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
  
  userCreateOrder : catchAsync(async (req,res)=>{
    const {_id,role} = req.user ;
    const {tableNumber,name,instructions,paymentMethod} = req.body ;

    if(!tableNumber)throw new AppError("Table Number Required!",400);

    const table = await Table.findOne({tableNumber});
    if(!table)throw new AppError("Table Not Found!",404);

    const {orderId,orderNumber,orderDate} = await getOrderId();

    const user = await User.findOne({_id}).populate("cart.item");    
    if(!user)throw new AppError("User Not Found!",404);
    if(user.cart?.length < 1)throw new AppError("Cart is Empty!",406);

    const availableItems = user.cart.filter( v => v.item.isAvailable !== false );

    const prepareTime = availableItems.reduce((accum,value)=>accum + value.item.prepTime,0);

    const createdAt = new Date();
    const readyAt = new Date(createdAt.getTime() + prepareTime * 60000);

    const orderItems = availableItems.map(c =>{
      return ({
        itemId : c.item._id,
        price : c.item.price,
        image : c.item.image,
        category : c.item.category,
        quantity : c.quantity,
        name : c.item.name,
        subTotal : c.item.price * c.quantity,
      })
    });

    const orderTotal = orderItems.reduce((accum,val)=>accum + val.subTotal,0);

    try{
      let razorpayOrder;

      if(paymentMethod === "prepaid"){
        const options = {
          amount : orderTotal * 100 ,
          currency: "INR",
          receipt: orderId
        }
        razorpayOrder = await razorpay.orders.create(options);
      }

      const order = await Order.create({
        orderId,
        orderNumber,
        orderType : "Dine-in",
        tableNumber,
        tableId :table._id,
        isAssisted : role === "waiter" ? true : false ,
        customerId : user._id,
        waiterId : table.waiterId,
        razorpayOrderId : razorpayOrder ? razorpayOrder.id : null,
        customerName : (name || user.name) + ` (${user.role})` ,
        status : role === "waiter" ? "accepted" : "initiated",
        orderItems,
        orderDate,
        instructions,
        orderTotal,
        prepareTime : readyAt,
        paymentStatus : "unpaid"
      });

      if(!order)throw new AppError("Order Creation Failed!",400);


      if(paymentMethod === "prepaid"){
        return res.status(201).json({
        message : "Order Created waiting for payment!",
        status : 201,
        order,
        razorpayOrder
      });
      }

      order.status = role === "waiter" ? "accepted" : "placed" ;
      order.save();

      await Table.updateOne({tableNumber},{$push : {tableOrders : order._id},isOccupied : true},{runValidators : true});
      await User.updateOne({_id},{$push : {orders : order._id}, $set : {cart : [],name}},{runValidators : true});

      if(role === "waiter"){
        io.to(`cook`).emit('order-accepted',{order});
      }else{
        io.to(table.waiterId?.toString()).emit("new-order",{order});
      }

      res.status(201).json({
        message : "Order Created Successfully!",
        status : 201,
        order
      });



    }catch(error){
      return res.status(500).json({message : error.message});
    }

  }),

  userCancelOrder : catchAsync(async(req,res)=>{
    const {id , razorpayOrderId } = req.body ;
    await Order.deleteOne({_id : id , razorpayOrderId , paymentStatus : {$nin :["prepaid","billed","paid"]}});
    res.status(200).json({message : "order deleted!"});
  }),

  viewOrderSummary : catchAsync(async (req,res)=>{
    const {_id} = req.user ;
    const user = await User.findOne({_id}).populate({
      path: "orders",
      options: {
        sort: { orderDate: -1, orderNumber: -1 }
      }
    });
    if(!user)throw new AppError("User Not Found!",404);

    res.status(200).json({
      message : "Orders Summary!",
      orders : user.orders,
      status : 200
    });
  })
}