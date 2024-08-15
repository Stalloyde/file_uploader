const express = require('express');
const passport = require('passport');
const router = express.Router();
const signup = require('../controllers/signup.js');

router.post('/', signup.signup);

module.exports = router;
