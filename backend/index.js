require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


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


//routers
const userRouter = require('./src/router/users.route.js');
app.use('/auth',userRouter);











//error handler
const errorHandler = require('./src/middleware/errorHandler.js');
app.use(errorHandler);