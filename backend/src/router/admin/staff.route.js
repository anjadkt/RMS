const express = require('express');
const router = express.Router();
const createStaffController = require('../../controller/user.controller.js');
const tableController = require('../../controller/table.controller.js');

router.post('/',createStaffController.createStaff);
router.post('/add',tableController.assignTable);


module.exports = router ;