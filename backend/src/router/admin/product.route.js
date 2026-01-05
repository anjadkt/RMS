const express = require('express');
const router = express.Router();
const productController = require('../../controller/product.controller.js');

router.post('/',productController.addItem);
router.delete('/:id',productController.removeItem);
router.post('/:id',productController.editItem);

module.exports = router