const router = require('express').Router()
const userController = require('../../controller/user.controller.js');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs : 1000 * 60 * 5,
  max : 5,
  message: {
    status : 429,
    message : 'Too many requests from this IP, please try again later.'
  }
});

//admin routes
router.post('/otp',limiter,userController.sendAdminOtp);
router.post('/login',userController.adminLogin);
router.get('/refresh',userController.handleRefreshToken);

module.exports = router