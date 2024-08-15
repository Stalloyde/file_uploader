const express = require('express');
const passport = require('passport');
const router = express.Router();
const login = require('../controllers/login.js');

router.post('/', login.login);

module.exports = router;
