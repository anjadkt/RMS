require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const verifyToken = require('./src/middleware/verifyToken.js');
const verifyUsers = require('./src/middleware/verifyUsers.js');

const {PORT,MONGO_DB_URL,USERFRONT_END_URL} = process.env

app.use(cors({
  origin : [USERFRONT_END_URL],
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


//customer routes
const userRouter = require('./src/router/customer/customer.route.js');
app.use('/auth/customer',userRouter);

const productRouter = require('./src/router/customer/product.route.js');
app.use('/items',productRouter);

const userCartRouter = require('./src/router/customer/cart.route.js');
app.use('/user/cart',verifyToken,verifyUsers("customer"),userCartRouter);

const userOrderRouter = require('./src/router/customer/userOrders.route.js');
app.use('/user/order',verifyToken,verifyUsers("customer"),userOrderRouter);


//admin routes

const adminRouter = require('./src/router/admin/admin.route.js');
app.use('/auth/admin',adminRouter);

const adminProductRouter = require('./src/router/admin/product.route.js');
app.use('/items/admin',verifyToken,verifyUsers("admin"),adminProductRouter);

const adminTableRouter = require('./src/router/admin/table.route.js');
app.use('/table/admin',verifyToken,verifyUsers("admin"),adminTableRouter)

//staff routes

const staffRouter = require('./src/router/waiter/users.route.js');
app.use('/auth/staff',staffRouter);

const cookProductRouter = require('./src/router/cook/product.route.js');
app.use('/items/cook',verifyToken,verifyUsers("cook","admin"),cookProductRouter);





//error handler
const errorHandler = require('./src/middleware/errorHandler.js');
app.use(errorHandler);