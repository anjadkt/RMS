require('dotenv').config();
const User = require('../model/users.model.js');
const AppError = require('../utils/AppError.js');
const catchAsync = require('../utils/catchAsync.js');
const OTP = require('../model/otp.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {SECRET_KEY,SECRET_REFRESH_KEY} = process.env ;

function getOtp(){
  return Math.floor(Math.random() * 900000 + 100000);
}

function getAccessToken(user){
  return jwt.sign({_id : user._id,isBanned : user.isBanned, role : user.role},SECRET_KEY,{expiresIn : "30m"});
}

function getRefreshToken(user){
  return jwt.sign({_id : user._id},SECRET_REFRESH_KEY,{expiresIn : "30d"});
}

module.exports = {
  sendOtp : catchAsync(async (req,res)=>{

    const number = req.body.number || "" ;

    if(!number)throw new AppError("Number Required",400);
    if( !/^[0-9]{10}$/.test(number)) throw new AppError("Enter a valid Number",400);

    const otp = getOtp();

    // send otp through twilio

    const hashedOtp = await bcrypt.hash(otp.toString(),10);
    await OTP.updateOne({phone : number},{
      otp : hashedOtp,
      expiresAt : new Date(Date.now() + 5 * 60 * 1000),
      phone : number
    },{upsert : true});

    res.status(201).json({
      otp,
      message : "otp created valid upto 5min",
      status : 201
    });
  }),

  verifyUser : catchAsync(async (req,res)=>{

    const {otp,number} = req.body ;
    if(!otp || !number)throw new AppError("Fields Required",400);

    const otps = await OTP.findOne({phone : number});
    if(!otps)throw new AppError("OTP Not Found!",404);
    if(otps.otp.expiresAt < Date.now())throw new AppError("OTP Expired!",);

    const isValid = await bcrypt.compare(otp.toString(),otps.otp);
    if(!isValid)throw new AppError("Incorrect OTP!",406);

    await OTP.deleteMany({phone : number});

    const user = await User.findOneAndUpdate({phone : number},{$set : {login : true},$setOnInsert : {phone : number,role : "customer"}},{upsert : true,new : true , runValidators : true});

    const accessToken = getAccessToken(user);

    const refreshToken = getRefreshToken(user);

    user.refreshToken = refreshToken
    await user.save();

    res.cookie("access_token",accessToken,{maxAge : 1000 * 60 * 30});

    res.cookie("refresh_token",refreshToken,{maxAge : 1000 * 60 * 60 * 24 * 30, httpOnly : true});

    res.status(201).json({
      message : "User login Successfull!",
      status : 201,
      accessToken
    });

  }),

  handleRefreshToken : catchAsync(async(req,res)=>{

    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken)throw new AppError("No Refresh Token!",403);

    const user = await User.findOne({refreshToken});
    if(!user)throw new AppError("Invalid Refresh Token!",403);

    jwt.verify(refreshToken,SECRET_REFRESH_KEY,(error,data)=>{
      if(error)throw new AppError("Refresh Token Expired!",403);
      const newAccessToken = getAccessToken(user);

      res.cookie("access_token",newAccessToken,{maxAge : 1000 * 60 * 30});

      res.status(201).json({
        message : "new access token created!",
        status : 201,
        accessToken : newAccessToken
      })
    })

  }),

  
}