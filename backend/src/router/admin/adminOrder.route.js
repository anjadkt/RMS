const express = require('express');
const router = express.Router();
const orderController = require('../../controller/adminOrder.controller.js');

router.get("/",orderController.getOrderData);

module.exports = router;