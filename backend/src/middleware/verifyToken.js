const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError.js');
const {SECRET_KEY} = process.env

module.exports = (req,res,next) => {

  const access_token = req.cookies.access_token
  if(!access_token) throw new AppError("Token Not Found!",401);

  jwt.verify(access_token,SECRET_KEY,(err,data)=>{
    if(err) return next(new AppError("Invalid Token",401));
    req.user = data ;
    next();
  })
}