const express = require('express');
const router = express.Router();
const cartController = require('../../controller/cart.controller.js');

router.get('/',cartController.getCartItems);
router.get('/add/:id',cartController.addItemsToCart);
router.get('/remove/:id',cartController.removeItemFromCart);

module.exports = router