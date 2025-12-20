const express = require('express');
const router = express.Router();
const tableController = require('../../controller/table.controller.js');

router.get('/table',tableController.getWaiterTable);


module.exports = router ;