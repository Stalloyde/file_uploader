const express = require('express');
const router = express.Router();
const folder = require('../controllers/folder.js');
const { isAuth } = require('./isAuth');

router.get('/', isAuth, folder.allFoldersGET);
router.put('/edit', isAuth, folder.editFolder);
router.post('/create', isAuth, folder.createFolder);
router.get('/:folderId', isAuth, folder.folderGET);
router.post('/:folderId/create', isAuth, folder.createFileInFolder);
router.get('/:folderId/:fileId', isAuth, folder.fileInFolderGET);
router.put('/:folderId/:fileId/edit', isAuth, folder.editFileInFolder);
router.delete('/:folderId/:fileId/delete', isAuth, folder.deleteFileInFolder);

module.exports = router;
