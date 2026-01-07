const express = require('express');
const router = express.Router();
const tableController = require('../../controller/table.controller.js');

router.post('/',tableController.createTable);
router.post('/add',tableController.assignTable);
router.get('/',tableController.getAllTables);
router.get('/:id',tableController.getAllTables);
router.delete('/:id',tableController.removeTable);

module.exports = router ;