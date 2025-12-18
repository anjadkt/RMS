const express = require('express');
const router = express.Router();
const cartController = require('../../controller/cart.controller.js');

router.get('/',cartController.getCartItems);
router.get('/add/:id',cartController.addItemsToCart);
router.get('/remove/:id',cartController.removeItemFromCart);
router.get('/empty',cartController.emptyCart);

module.exports = router