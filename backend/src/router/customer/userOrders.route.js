const express = require('express');
const router = express.Router();
const orderController = require('../../controller/userOrder.controller.js');

router.post('/',orderController.userCreateOrder);
router.get('/',orderController.viewOrderSummary);


module.exports = router ;