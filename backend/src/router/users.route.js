const router = require('express').Router()
const userController = require('../controller/user.controller.js');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs : 1000 * 60 * 5,
  max : 5,
  message: {
    status : 429,
    message : 'Too many requests from this IP, please try again later.'
  }
});

router.post('/customer/otp',limiter,userController.sendUserOtp);
router.post('/customer/login',userController.verifyUser);
router.get('/customer/refresh',userController.handleRefreshToken);
//router.get('/admin/register',userController.adminRegister);

//admin routes
router.post('/admin/otp',userController.sendAdminOtp);
router.post('/admin/login',userController.adminLogin);
router.get('/admin/refresh',userController.handleRefreshToken);
router.post('/admin/staff',userController.createStaff);

//staff routes
router.post('/staff/login',userController.staffLogin);

module.exports = router