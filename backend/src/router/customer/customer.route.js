const router = require('express').Router()
const userController = require('../../controller/user.controller.js');
const rateLimiter = require('../../middleware/rateLimiter.js');

router.post('/otp',rateLimiter(10,5),userController.sendUserOtp);
router.post('/login',userController.verifyUser);

module.exports = router