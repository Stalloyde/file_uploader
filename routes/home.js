const express = require('express');
const passport = require('passport');
const router = express.Router();
const home = require('../controllers/home.js');
const { isAuth } = require('./isAuth');

/* GET home page. */
router.get('/', isAuth, home.homepage);
router.post('/', isAuth, home.createFolder);
router.post('/', isAuth, home.createFile);

module.exports = router;
