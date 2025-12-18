module.exports = (err,req,res,next)=>{
  console.error(err.stack);
  res.status(err.status || 500).json({
    message : err.message || "Internal Server Error",
    status : err.status || 500,
    ok : false,
    success : false
  });
}