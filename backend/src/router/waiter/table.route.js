const express = require('express');
const router = express.Router();
const tableController = require('../../controller/table.controller.js');

router.get('/',tableController.getWaiterTable);
router.get('/:id',tableController.getWaiterTable);


module.exports = router ;