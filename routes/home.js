const express = require('express');
const passport = require('passport');
const router = express.Router();
const home = require('../controllers/home.js');

/* GET home page. */
router.post('/signup', home.signup);
router.post('/login', home.login);
router.get('/', home.homepage);
router.post('/', home.createFolder);
router.post('/', home.createFile);

module.exports = router;
