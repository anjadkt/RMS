const express = require('express');
const router = express.Router();
const orderController = require('../../controller/staffOrder.controller.js');

router.post('/',orderController.prepareOrder);


module.exports = router ;