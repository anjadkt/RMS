const express = require('express');
const router = express.Router();
const orderController = require('../../controller/staffOrder.controller.js');
const availController = require('../../controller/product.controller.js');

router.post('/',orderController.prepareOrder);
router.get('/:status',orderController.getChefOrders);

module.exports = router ;