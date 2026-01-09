require('dotenv').config();
const User = require('../model/users.model.js');
const Table = require('../model/table.model.js');
const Order = require('../model/order.model.js');
const AppError = require('../utils/AppError.js');
const catchAsync = require('../utils/catchAsync.js');
const OTP = require('../model/otp.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/email.js');
const client = require('../utils/send_sms.js');

const {SECRET_KEY,SECRET_REFRESH_KEY,TWILIO_PHONE} = process.env ;

function getOtp(){
  return Math.floor(Math.random() * 900000 + 100000);
}

function getAccessToken(user){
  return jwt.sign({_id : user._id,isBanned : user.isBanned, role : user.role},SECRET_KEY,{expiresIn : "30m"});
}

function getRefreshToken(user){
  return jwt.sign({_id : user._id},SECRET_REFRESH_KEY,{expiresIn : user.role === "waiter" ? "7d" : "30d"});
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

    const user = await User.findOne({phone : number});
    if(user.isBanned)throw new AppError("User Blocked",403);

    if(!number)throw new AppError("Number Required",400);
    if( !/^\+91[0-9]{10}$/.test(number)) throw new AppError("Enter a valid Number",400);

    const otp = getOtp();

    const hashedOtp = await bcrypt.hash(otp.toString(),10);
    await OTP.updateOne({phone : number},{
      otp : hashedOtp,
      expiresAt : new Date(Date.now() + 5 * 60 * 1000),
      phone : number
    },{upsert : true,runValidators : true});


    const message = await client.messages.create({
      body: `Your OTP for verification is ${otp}.\nIt is valid for 5 minutes. Do not share this code with anyone.`,
      from: TWILIO_PHONE,
      to: number
    });

    res.status(201).json({
      message : `otp send to ${message.to}`,
      ok : true ,
      status : 201
    });

    // res.status(201).json({
    //   otp,
    //   message : `otp send to `,
    //   ok : true ,
    //   status : 201
    // });
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

    const user = await User.findOneAndUpdate({phone : number},{$setOnInsert : {phone : number,role : "customer"}},{upsert : true,new : true , runValidators : true});
    if(user.isBanned)throw new AppError("User Blocked",403);

    const accessToken = getAccessToken(user);

    const refreshToken = getRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("access_token",accessToken,{maxAge : 1000 * 60 * 30});

    res.cookie("refresh_token",refreshToken,{maxAge : 1000 * 60 * 60 * 24 * 30, httpOnly : true});

    res.status(201).json({
      message : "User login Successfull!",
      status : 201,
      ok : true,
      accessToken
    });

  }),

  getUserData : catchAsync(async (req,res)=>{
    const {_id} = req.user ;
    const user = await User.findOne({_id});
    if(!user)throw new AppError("User Not Found!",404);
    res.status(200).json({
      message : "User Data Found!",
      userData : {
        isBanned : user.isBanned,
        role : user.role,
        cart : user.cart,
        name : user.name,
        phone : user.phone,
        orders : user.orders,
        notification : user.notification,
        details : user.details,
        isWorking : user.isWorking,
        tables : user.tables
      },
      status : 200,
      ok : true
    })
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
        message : `new access token created for ${user.role} !`,
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
    if(!isValidEmail(email))throw new AppError("Email is Not provided",400);

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

    const {name,details,role,email} = req.body ;

    if(!name|| !role || !isValidEmail(email))throw new AppError("Invalid Data!",400);

    const createStaffId = ()=>{
      return `${role === "waiter" ? "WTR" : "CHF"}-${Date.now().toString().slice(-5)}`
    }

    const isStaff = await User.findOne({email});
    if(isStaff)throw new AppError("Staff Already Exist!",409);

    const user = await User.create({
      name,
      role,
      email,
      details:{
        address : details.address,
        number : details.number,
        photo : details.photo
      },
      staffId : createStaffId(),
      isWorking : false
    });

    const token = jwt.sign({_id : user._id , email},process.env.STAFF_PASS_KEY,{expiresIn : "5m"});

    const mailOptions = {
      from: `<PARAGON>`,
      to: email,
      subject: "Welcome to the Team – Set Your Password",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color:#111; line-height:1.5;">
          
        <p>Hi ${user.name},</p>

        <p>
          Welcome to Paragon.  
          Your staff account has been created. Your Staff ID is <br> ${user.staffId}</b>.
          use this to login!
        </p>

        <p>
          Please set your password using the link below:
        </p>

        <p>
          <a href="${process.env.STAFFFRONT_END_URL + "/staff/password/"+ token}">
            Set your password
          </a>
        </p>

        <p>
          This link will expire in 5 min.
        </p>

        <p>
          Thanks,<br/>
          -Paragon Manager
        </p>

          </body>
        </html>

      
      `

    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message : "staff creation successfull!",
      status : 201,
      staffId : user.staffId,
      role
    });

  }),

  setStaffPassword : catchAsync(async (req,res)=>{
    const {token , pin} = req.body ;
    if(pin.trim().length < 6) throw new AppError("Password Atleast 6 digits",400);
    const data = jwt.verify(token,process.env.STAFF_PASS_KEY);
    if(!data)throw new AppError("Invalid Token!",400);

    const user = await User.findOne({_id : data._id});

    const hashedPin = await bcrypt.hash(pin.toString(),10);
    user.pin = hashedPin;
    user.isWorking = true ;
    await user.save();

    res.status(201).json({
      message : "user password set"
    })

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
    
    await user.save();

    res.cookie("access_token",accessToken,{maxAge : 1000 * 60 * 30});

    res.cookie("refresh_token",refreshToken,{maxAge : 1000 * 60 * 60 * 24 * 7, httpOnly : true});

    res.status(200).json({
      message : "staff login successfull!",
      status : 200,
      accessToken
    });
  }),

  getAllUsers : catchAsync(async(req,res)=>{
    const {q,user} = req.query ;
    if(!["cook","waiter","customer","staffs"].includes(user))throw new AppError(user + " not a valid user",400);

    const query = {
      role : user
    }

    if(user==="staffs"){
      query.role = {$in : ["waiter","cook"]}
    }

    if(q.trim()){
      query.staffId = {$regex : q , $options : "i"}
    }

    if(q.trim() && user === "customer"){
      query.phone = {$regex : q , $options : "i"}
    }

    const users = await User.find(query);

    res.status(200).json(users);
  }),

  getUserAdminData : catchAsync(async (req,res)=>{
    const {id} = req.params ;
    const user = await User.findOne({_id : id});
    const tables = await Table.find({waiterId : id});
    const allTables = await Table.find({waiterId : {$ne : id}, tableNumber : {$exists : true}});
    const orders = await Order.find({waiterId : id , status : {$nin : ["completed","pending"]}});

    if(!user)throw new AppError("User Not Found!",404);
    res.status(200).json({
      user : {
        name : user.name,
        number : user.details.number,
        address : user.details.address,
        photo : user.details.photo,
        isWorking : user.isWorking,
        role : user.role,
        staffId : user.staffId,
        _id : user._id
      },
      tables,
      allTables,
      orders
    });
  }),

  getCusomerData : catchAsync(async (req,res)=>{
    const {id} = req.params ;
    const user = await User.findOne({_id : id}).populate('orders');
    if(!user)throw new AppError("User Not Found!",404);
    res.status(200).json({
      user : {
        name : user.name,
        number : user.phone,
        isBanned : user.isBanned,
        role : user.role,
        orders : user.orders,
        _id : user._id
      }
    });
  }),

  manageUsers : catchAsync(async (req,res)=>{
    const {role,id,action} = req.body ;
    const query = {

    }
    if(role === "waiter" || role === "cook"){
      query.isWorking = action ;
    }

    if(role === "customer"){
      query.isBanned = action ;
    }

    const user = await User.findOneAndUpdate({_id : id},query,{runValidators : true , new : true});
    return res.status(200).json(user);

  }),

  removeStaff : catchAsync(async (req,res)=>{
    const {id} = req.params ;
    await Table.updateMany({waiterId : id},{waiterId : null});
    await User.deleteOne({_id : id});
    res.status(200).json({
      message : "user deleted!"
    })
  }),

  setUserLogout : catchAsync(async (req,res)=>{
    const {_id} = req.user ;
    await User.findOneAndUpdate({_id},{refreshToken : ""});
    res.clearCookie("access_token")

    res.clearCookie("refresh_token",{
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  })

}