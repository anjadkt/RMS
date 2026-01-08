const express = require('express');
const router = express.Router();
const restoController = require('../../controller/restaurent.controller.js');

router.post('/',restoController.updateRestoSettings);
router.post('/offer',restoController.createOffer);
router.delete('/offer/:id',restoController.removeOffer);

module.exports = router ;