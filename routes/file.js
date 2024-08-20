const express = require('express');
const router = express.Router();
const file = require('../controllers/file.js');
const { isAuth } = require('./isAuth');

router.get('/', isAuth, file.allFilesGET);
router.get('/:fileId', isAuth, file.targetFileGET);
router.put('/:fileId/edit', isAuth, file.editFile);
router.delete('/:fileId/delete', isAuth, file.deleteFile);

module.exports = router;
