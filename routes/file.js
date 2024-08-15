const express = require('express');
const router = express.Router();
const file = require('../controllers/file.js');
const { isAuth } = require('./isAuth');

router.get('/', isAuth, file.fileGET);
router.post('/create', isAuth, file.createFile);
router.put('/edit', isAuth, file.editFile);
router.delete('/delete', isAuth, file.deleteFile);

module.exports = router;
