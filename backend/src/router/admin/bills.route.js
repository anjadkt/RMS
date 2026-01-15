const express = require('express');
const router = express.Router();
const billController = require('../../controller/bill.controller.js');

router.post('/',billController.completeBill);

module.exports = router ;