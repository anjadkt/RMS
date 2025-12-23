const express = require('express');
const router = express.Router();
const productController = require('../../controller/product.controller.js');

router.get('/:id',productController.changeAvailability);

module.exports = router