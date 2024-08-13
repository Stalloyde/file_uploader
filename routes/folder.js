const express = require('express');
const router = express.Router();
const folder = require('../controllers/folder.js');

router.get('/:folderId', folder.folderGET);
router.post('/:folderId/create', folder.createFileInFolder);
router.get('/:folderId/:fileId', folder.fileInFolderGET);
router.put('/:folderId/:fileId/edit', folder.editFileInFolder);
router.delete('/:folderId/:fileId/delete', folder.deleteFileInFolder);

module.exports = router;
