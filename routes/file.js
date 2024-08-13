const express = require('express');
const router = express.Router();
const file = require('../controllers/file.js');

router.get('/:filename', file.fileGET);
router.post('/:filename/create', file.createFile);
router.put('/:filename/edit', file.editFile);
router.delete('/:filename/delete', file.deleteFile);

module.exports = router;
