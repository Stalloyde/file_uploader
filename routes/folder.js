const express = require('express');
const router = express.Router();
const folder = require('../controllers/folder.js');
const { isAuth } = require('./isAuth');

router.get('/', isAuth, folder.folderGET);
router.post('/create', isAuth, folder.createFileInFolder);
router.get('/:fileId', isAuth, folder.fileInFolderGET);
router.put('/:fileId/edit', isAuth, folder.editFileInFolder);
router.delete('/:fileId/delete', isAuth, folder.deleteFileInFolder);

module.exports = router;
