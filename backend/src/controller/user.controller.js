require('dotenv').config();
const User = require('../model/users.model.js');
const AppError = require('../utils/AppError.js');
const catchAsync = require('../utils/catchAsync.js');
const OTP = require('../model/otp.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/email.js');

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

function isValidEmail(email) {
  if (!email) return false;

  if (typeof email !== "string") return false;

  email = email.trim().toLowerCase();

  if (email.length > 254) return false;

  if (email.includes(" ")) return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;

  if (!local || !domain) return false;
  if (local.length > 64) return false;

  if (!domain.includes(".")) return false;

  return true;
}


module.exports = {
  sendUserOtp : catchAsync(async (req,res)=>{

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
    if(otps.expiresAt < Date.now())throw new AppError("OTP Expired!",);

    const isValid = await bcrypt.compare(otp.toString(),otps.otp);
    if(!isValid)throw new AppError("Incorrect OTP!",406);

    await OTP.deleteMany({phone : number});

    const user = await User.findOneAndUpdate({phone : number},{$set : {login : true},$setOnInsert : {phone : number,role : "customer"}},{upsert : true,new : true , runValidators : true});

    const accessToken = getAccessToken(user);

    const refreshToken = getRefreshToken(user);

    user.refreshToken = refreshToken;
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

      if (user._id.toString() !== data._id) {
        throw new AppError("Token mismatch", 403);
      }

      const newAccessToken = getAccessToken(user);

      res.cookie("access_token",newAccessToken,{maxAge : 1000 * 60 * 30});

      res.status(201).json({
        message : "new access token created!",
        status : 201,
        accessToken : newAccessToken
      })
    })

  }),

  // adminRegister : catchAsync(async (req,res)=>{
  //   const hashedPassword = await bcrypt.hash("admin1234",10);
  //   await User.create({
  //     name : "Admin",
  //     password : hashedPassword ,
  //     email : "anjad076@gmail.com",
  //     role : "admin"
  //   })
  // })

  sendAdminOtp : catchAsync(async(req,res)=>{
    const email = req.body.email;
    if(!isValidEmail(email))throw AppError("Email is Not provided",400);

    const otp = getOtp();

    const hashedOtp = await bcrypt.hash(otp.toString(),10);
    await OTP.updateOne({email},{
      otp : hashedOtp,
      expiresAt : new Date(Date.now() + 5 * 60 * 1000),
      email
    },{upsert : true});

    const mailOptions = {
      from: `<ROMS>`,
      to: email,
      subject: "Your OTP Code",
      html: `
          <h2>Email Verification</h2>

          <p>Hello,</p>

          <p>
          Use the verification code below to continue.
          </p>

          <h1>${otp}</h1>

          <p>
          This code is valid for 5 minutes.
          </p>

          <p>
          If you did not request this, you can safely ignore this email.
          </p>

          <p>
          — ROMS
          </p>
      `

    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message : "admin otp send success!",
      status : 200
    })

  }),

  adminLogin : catchAsync(async(req,res)=>{
    const {email,password,otp} = req.body;
    if(!isValidEmail(email) || password.trim().length < 8 || !otp)throw new AppError("Invalid Data",400);

    const user = await User.findOne({email});
    if(!user)throw new AppError("Admin Not Found",404);
    
    const otpDoc = await OTP.findOne({email});
    if(!otpDoc)throw new AppError("OTP Not Found Or Expired!",404);
    if(otpDoc.otp.expiresAt < Date.now())throw new AppError("OTP Expired!",);
    
    const isValid = await bcrypt.compare(otp.toString(),otpDoc.otp);
    if(!isValid)throw new AppError("Incorrect OTP!",406);

    const isValidPass = await bcrypt.compare(password,user.password);
    if(!isValidPass)throw new AppError("Incorrect Password!",406);

    await OTP.deleteMany({email});

    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);

    user.refreshToken = refreshToken
    user.login = true

    await user.save();

    res.cookie("access_token",accessToken,{maxAge : 1000 * 60 * 30});

    res.cookie("refresh_token",refreshToken,{maxAge : 1000 * 60 * 60 * 24 * 30, httpOnly : true});

    res.status(200).json({
      message : "admin login successfull!",
      status : 200,
      accessToken
    });

  }),

  createStaff : catchAsync(async(req,res)=>{

    const {name,details,role,pin} = req.body ;

    if(!name|| !role || !pin)throw new AppError("Invalid Data!",400);
    if(pin.toString().length < 6)throw new AppError("Pin must be greater than 6",400);

    const createStaffId = ()=>{
      return `${role === "waiter" ? "WTR" : "CHF"}-${Date.now().toString().slice(-5)}`
    }

    const isStaff = await User.findOne({"details.number":details.number});
    if(isStaff)throw new AppError("Mobile Number/ Staff Already Exist!",409);

    const hashedPin = await bcrypt.hash(pin.toString(),10);

    const user = await User.create({
      name,
      role,
      details:{
        address : details.address,
        number : details.number,
        photo : details.photo
      },
      staffId : createStaffId(),
      pin : hashedPin
    });

    res.status(201).json({
      message : "staff creation successfull!",
      status : 201,
      staffId : user.staffId,
      role
    });

  }),

  staffLogin : catchAsync(async(req,res)=>{

    const {staffId,pin} = req.body
    if(!staffId.trim() || !pin)throw new AppError("Invalid Data!",400);
    
    const user = await User.findOne({staffId});
    if(!user)throw new AppError("User Not Found!",404);

    const isValid = await bcrypt.compare(pin.toString(),user.pin);
    if(!isValid)throw new AppError("Incorrect Password",406);

    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);

    user.refreshToken = refreshToken
    user.login = true

    await user.save();

    res.cookie("access_token",accessToken,{maxAge : 1000 * 60 * 30});

    res.cookie("refresh_token",refreshToken,{maxAge : 1000 * 60 * 60 * 24 * 30, httpOnly : true});

    res.status(200).json({
      message : "staff login successfull!",
      status : 200,
      accessToken
    });
  })

}