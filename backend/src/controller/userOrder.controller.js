const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');
const User = require('../model/users.model.js');
const Order = require('../model/order.model.js');
const Table = require('../model/table.model.js');

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
    const {tableNumber,name,instructions} = req.body ;

    if(!tableNumber)throw new AppError("Table Number Required!",400);

    const table = await Table.findOne({tableNumber});
    if(!table)throw new AppError("Table Not Found!",404);

    const {orderId,orderNumber,orderDate} = await Promise.resolve(getOrderId());

    const user = await User.findOne({_id}).populate("cart.item");
    if(!user)throw new AppError("User Not Found!",404);
    if(user.cart?.length < 1)throw new AppError("Cart is Empty!",406);

    const orderItems = user.cart?.map(c =>{
      return ({
        itemId : c.item._id,
        price : c.item.price,
        image : c.item.image,
        category : c.item.category,
        quantity : c.quantity,
        name : c.item.name,
        subTotal : c.item.price * c.quantity
      })
    });

    const orderTotal = orderItems.reduce((accum,val)=>accum + val.subTotal,0);

    const order = await Order.create({
      orderId,
      orderNumber,
      orderType : "Dine-in",
      tableNumber,
      tableId :table._id,
      isAssisted : role === "waiter" ? true : false ,
      customerId : user._id,
      waiterId : table.waiterId,
      customerName : name,
      status : role === "waiter" ? "accepted" : "placed",
      orderItems,
      orderDate,
      instructions,
      orderTotal
    });
    if(!order)throw new AppError("Order Creation Failed!",400);

    await Table.updateOne({tableNumber},{$push : {tableOrders : order._id}},{runValidators : true});
    await User.updateOne({_id},{$push : {orders : order._id}, $set : {cart : [],name}},{runValidators : true});

    if(role === "waiter"){
      //notify chef
    }else{
      //notify waiter
    }

    res.status(201).json({
      message : "Order Created Successfully!",
      status : 201,
      order
    });
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