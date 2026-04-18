const express = require('express');
const router = express.Router();
const orderController = require('../../controller/userOrder.controller.js');
const userController = require('../../controller/user.controller.js');
const rateLimiter = require('../../middleware/rateLimiter.js');

router.post('/',rateLimiter(10,5),orderController.userCreateOrder);
router.get('/',orderController.viewOrderSummary);
router.post('/cancel',orderController.userCancelOrder);
router.get('/notification/:id',userController.removeNotification);



module.exports = router ;