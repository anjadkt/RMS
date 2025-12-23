const express = require('express');
const router = express.Router();
const orderRouter = require('../../controller/staffOrder.controller.js');
const updateCartRouter = require('../../controller/cart.controller.js');
const createOrderRouter = require('../../controller/userOrder.controller.js');

router.get('/',orderRouter.getWaiterOrders);
router.post('/',orderRouter.confirmOrder);
router.post('/bill',orderRouter.genBill);
router.post('/payment',orderRouter.orderPayment);
//crateorder
router.get('/add/:id',updateCartRouter.addItemsToCart);
router.get('/remove/:id',updateCartRouter.removeItemFromCart);
router.post('/add',createOrderRouter.userCreateOrder);


module.exports = router ;