const express = require('express');
const router = express.Router();
const folder = require('../controllers/folder.js');
const { isAuth } = require('./isAuth');
const multer = require('multer');
const upload = multer({ dest: 'public/data/uploads/' });

router.get('/', isAuth, folder.allFoldersGET);
router.post('/create', isAuth, folder.createFolder);
router.put('/edit', isAuth, folder.editFolder);
router.delete('/delete', isAuth, folder.deleteFolder);
router.get('/:folderId', isAuth, folder.folderGET);
router.post(
  '/:folderId/create',
  isAuth,
  upload.single('newFile'),
  folder.createFileInFolder,
);
router.get('/:folderId/:fileId', isAuth, folder.fileInFolderGET);
router.put('/:folderId/:fileId/edit', isAuth, folder.editFileInFolder);
router.delete('/:folderId/:fileId/delete', isAuth, folder.deleteFileInFolder);

module.exports = router;
