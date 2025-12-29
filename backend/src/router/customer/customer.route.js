const router = require('express').Router()
const userController = require('../../controller/user.controller.js');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs : 1000 * 60 * 5,
  max : 20,
  message: {
    status : 429,
    message : 'Too many requests from this IP, please try again later.'
  }
});

router.post('/otp',limiter,userController.sendUserOtp);
router.post('/login',userController.verifyUser);

module.exports = router