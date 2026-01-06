const express = require('express');
const router = express.Router();
const staffController = require('../../controller/user.controller.js');
const tableController = require('../../controller/table.controller.js');

router.post('/',staffController.createStaff);
router.post('/add',tableController.assignTable);
router.get('/',staffController.getAllUsers);
router.get('/:id',staffController.getUserAdminData);
router.post('/manage',staffController.manageUsers);
router.delete('/:id',staffController.removeStaff);


module.exports = router ;