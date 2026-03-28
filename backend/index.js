require('dotenv').config();
const express = require('express');
const app = express();
app.set("trust proxy", 1);
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const server = http.createServer(app);

const {PORT,MONGO_DB_URL,USERFRONT_END_URL,STAFFFRONT_END_URL} = process.env ;

app.use(cors({
  origin : [USERFRONT_END_URL,STAFFFRONT_END_URL],
  methods : ["GET","POST","PUT","DELETE"],
  credentials : true
}));

const {initSocket} = require('./src/utils/socket.js');
initSocket(server);



const cookieParser = require('cookie-parser');
const verifyToken = require('./src/middleware/verifyToken.js');
const verifyUsers = require('./src/middleware/verifyUsers.js');
const signatureTest = require('./src/middleware/signature.js');

const refreshController = require('./src/controller/user.controller.js');
const itemsController = require('./src/controller/product.controller.js');
const webhooksController = require('./src/controller/webhook.controller.js');

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
const billAdminRouter = require('./src/router/admin/bills.route.js');


const staffRouter = require('./src/router/waiter/users.route.js');
const waiterTableRouter = require('./src/router/waiter/table.route.js');
const waiterOrderRouter = require('./src/router/waiter/orders.route.js');
const billRouter = require('./src/router/waiter/bills.route.js');

const cookProductRouter = require('./src/router/cook/product.route.js');
const cookOrderRouter = require('./src/router/cook/order.route.js');

mongoose.connect(MONGO_DB_URL)
.then(()=>{
  console.log("Mongo DB connected!");

  server.listen(PORT,'0.0.0.0',()=>{
    console.log("Server is Listening....");
  })
});



app.post('/webhooks/razorpay',express.raw({ type: "application/json" }),signatureTest,webhooksController.markPaymentCompleted);

//system middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get('/auth/refresh',refreshController.handleRefreshToken);
app.get('/items/category',itemsController.getItemsCategory);
app.get('/auth/user',verifyToken,refreshController.getUserData);
app.get('/user/logout',verifyToken,refreshController.setUserLogout);

app.get('/',()=>{
  res.status(200).json({message : "server is running"});
})


//customer routes
app.use('/auth/customer',userRouter);
app.use('/items',productRouter);
app.use('/resto',restoDataRouter);
app.use('/user/cart',verifyToken,verifyUsers("customer","waiter"),userCartRouter);
app.use('/user/order',verifyToken,verifyUsers("customer","waiter"),userOrderRouter);

// const Table = require('./src/model/table.model.js');
// const Item = require('./src/model/items.model.js');
// app.get('/add',async (req,res)=>{
//   await Table.updateMany({},{ $unset: { qrCode: "" } });
// })

//admin routes
app.use('/auth/admin',adminRouter);
app.use('/admin/orders',verifyToken,verifyUsers("admin"),adminOrderRouter);
app.use('/items/admin',verifyToken,verifyUsers("admin"),adminProductRouter);
app.use('/table/admin',verifyToken,verifyUsers("admin"),adminTableRouter);
app.use('/staff/admin',verifyToken,verifyUsers("admin"),adminStaffRouter);
app.use('/resto/admin',verifyToken,verifyUsers("admin"),restoRouter);
app.use('/admin/bills',verifyToken,verifyUsers("admin"),billAdminRouter);

//waiter routes
app.use('/auth/staff',staffRouter);
app.use('/waiter/table',verifyToken,verifyUsers("admin","waiter"),waiterTableRouter);
app.use('/waiter/orders',verifyToken,verifyUsers("waiter","admin"),waiterOrderRouter);
app.use('/waiter/bills',verifyToken,verifyUsers("waiter","admin"),billRouter);

//cook routes
app.use('/items/cook',verifyToken,verifyUsers("cook","admin"),cookProductRouter);
app.use('/orders/cook',verifyToken,verifyUsers("cook","admin"),cookOrderRouter);



//error handler
const errorHandler = require('./src/middleware/errorHandler.js');
app.use(errorHandler);