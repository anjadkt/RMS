const jwt = require('jsonwebtoken');
const AppError = require('../utils/errorHandler.js');
const {SECRET_KEY} = process.env

module.exports = (req,res,next) => {

  const {token} = req.cookies;
  if(!token) throw new AppError("Token Not Found!",404);

  jwt.verify(token,SECRET_KEY,(err,data)=>{
    if(err)throw new AppError("Invalid Token",406);
    req.user = data ;
    next()
  })
}