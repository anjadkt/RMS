const express = require('express');
const router = express.Router();
const billController = require('../../controller/bill.controller.js');
const genBillController = require('../../controller/staffOrder.controller.js');

router.post('/',billController.completeBill);
router.post('/gen',genBillController.orderPayment);

module.exports = router ;