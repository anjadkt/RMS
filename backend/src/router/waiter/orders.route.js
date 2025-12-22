const express = require('express');
const router = express.Router();
const orderRouter = require('../../controller/staffOrder.controller.js');

router.get('/',orderRouter.getWaiterOrders);
router.post('/',orderRouter.confirmOrder);

module.exports = router ;