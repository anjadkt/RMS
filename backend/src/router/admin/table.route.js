const express = require('express');
const router = express.Router();
const tableController = require('../../controller/adminTable.controller.js');

router.post('/',tableController.createTable);

module.exports = router ;