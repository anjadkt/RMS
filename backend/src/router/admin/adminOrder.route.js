const express = require('express');
const router = express.Router();
const orderController = require('../../controller/adminOrder.controller.js');

router.get("/",orderController.getOrders);
router.post('/',orderController.changeOrderStatus);
router.get("/dashboard",orderController.getDashboardData);

module.exports = router;