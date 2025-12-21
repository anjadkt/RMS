const express = require('express');
const router = express.Router();
const restoRouter = require('../../controller/restaurent.controller.js');

router.get('/',restoRouter.getWebsiteData);

module.exports = router