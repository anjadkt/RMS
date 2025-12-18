const AppError  = require('../utils/AppError.js');

module.exports = (...allowedRoles)=>{
  return (req,res,next)=>{
    if(!allowedRoles.includes(req.user?.role)){
      return next(new AppError("Forbidden Route!",403));
    }
    next();
  }
}