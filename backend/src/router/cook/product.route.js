const express = require('express');
const router = express.Router();
const productController = require('../../controller/product.controller.js');

router.post('/:id',productController.changeAvailability);

module.exports = router