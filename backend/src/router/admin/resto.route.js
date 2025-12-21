const express = require('express');
const router = express.Router();
const restoController = require('../../controller/restaurent.controller.js');

router.post('/',restoController.updateRestoSettings);

module.exports = router ;