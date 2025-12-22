const router = require('express').Router()
const userController = require('../../controller/user.controller.js');

router.post('/login',userController.staffLogin);
router.get('/refresh',userController.handleRefreshToken);

module.exports = router ;