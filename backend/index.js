require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const verifyToken = require('./src/middleware/verifyToken.js');
const verifyUsers = require('./src/middleware/verifyUsers.js');

const refreshController = require('./src/controller/user.controller.js');
const itemsController = require('./src/controller/product.controller.js');

const userRouter = require('./src/router/customer/customer.route.js');
const productRouter = require('./src/router/customer/product.route.js');
const restoDataRouter = require('./src/router/customer/resto.route.js');
const userOrderRouter = require('./src/router/customer/userOrders.route.js');
const userCartRouter = require('./src/router/customer/cart.route.js');

const adminRouter = require('./src/router/admin/admin.route.js');
const adminProductRouter = require('./src/router/admin/product.route.js');
const adminTableRouter = require('./src/router/admin/table.route.js');
const adminStaffRouter = require('./src/router/admin/staff.route.js');
const restoRouter = require('./src/router/admin/resto.route.js');
const adminOrderRouter = require('./src/router/admin/adminOrder.route.js');


const staffRouter = require('./src/router/waiter/users.route.js');
const waiterTableRouter = require('./src/router/waiter/table.route.js');
const waiterOrderRouter = require('./src/router/waiter/orders.route.js');

const cookProductRouter = require('./src/router/cook/product.route.js');
const cookOrderRouter = require('./src/router/cook/order.route.js');

const {PORT,MONGO_DB_URL,USERFRONT_END_URL,STAFFFRONT_END_URL} = process.env ;



app.use(cors({
  origin : [USERFRONT_END_URL,STAFFFRONT_END_URL],
  methods : ["GET","POST","PUT","DELETE"],
  credentials : true
}));

mongoose.connect(MONGO_DB_URL)
.then(()=>{
  console.log("Mongo DB connected!");
  app.listen(PORT,()=>{
    console.log("Server is Listening....");
  })
});


//system middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get('/auth/refresh',refreshController.handleRefreshToken);
app.get('/items/category',itemsController.getItemsCategory);
app.get('/auth/user',verifyToken,refreshController.getUserData);


//customer routes
app.use('/auth/customer',userRouter);
app.use('/items',productRouter);
app.use('/resto',restoDataRouter);
app.use('/user/cart',verifyToken,verifyUsers("customer","waiter"),userCartRouter);
app.use('/user/order',verifyToken,verifyUsers("customer","waiter"),userOrderRouter);

const Table = require('./src/model/table.model.js');
app.get('/add',async (req,res)=>{
  await Table.updateMany({},{isOccupied : false});
})

//admin routes
app.use('/auth/admin',adminRouter);
app.use('/admin/orders',adminOrderRouter);
app.use('/items/admin',verifyToken,verifyUsers("admin"),adminProductRouter);
app.use('/table/admin',verifyToken,verifyUsers("admin"),adminTableRouter);
app.use('/staff/admin',verifyToken,verifyUsers("admin"),adminStaffRouter);
app.use('/resto/admin',verifyToken,verifyUsers("admin"),restoRouter);

//waiter routes
app.use('/auth/staff',staffRouter);
app.use('/waiter/table',verifyToken,verifyUsers("admin","waiter"),waiterTableRouter);
app.use('/waiter/orders',verifyToken,verifyUsers("waiter"),waiterOrderRouter);

//cook routes
app.use('/items/cook',verifyToken,verifyUsers("cook","admin"),cookProductRouter);
app.use('/orders/cook',verifyToken,verifyUsers("cook","admin"),cookOrderRouter);



//error handler
const errorHandler = require('./src/middleware/errorHandler.js');
app.use(errorHandler);