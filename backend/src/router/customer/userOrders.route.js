const express = require('express');
const router = express.Router();
const orderController = require('../../controller/userOrder.controller.js');
const userController = require('../../controller/user.controller.js');

router.post('/',orderController.userCreateOrder);
router.get('/',orderController.viewOrderSummary);
router.get('/notification/:id',userController.removeNotification);



module.exports = router ;