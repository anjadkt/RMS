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















//error handler
app.use((err,req,res,next)=>{
  res.status(err.status || 500).json({
    message : err.message || "Internal Server Error",
    status : err.status || 500,
    ok : false,
    success : false
  });
})