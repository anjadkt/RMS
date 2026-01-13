const express = require('express');
const router = express.Router();
const billController = require('../../controller/bill.controller.js');

router.post('/',billController.getBills);

module.exports = router ;