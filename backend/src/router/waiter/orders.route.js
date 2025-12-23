const express = require('express');
const router = express.Router();
const orderRouter = require('../../controller/staffOrder.controller.js');

router.get('/',orderRouter.getWaiterOrders);
router.post('/',orderRouter.confirmOrder);
router.post('/bill',orderRouter.genBill);
router.post('/payment',orderRouter.orderPayment);

module.exports = router ;