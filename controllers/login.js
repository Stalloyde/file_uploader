const passport = require('passport');
const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.login = [
  body('username').trim().notEmpty().escape(),
  body('password').trim().notEmpty().escape(),

  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    next();
  }),

  expressAsyncHandler(async (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json(info);
      } // info is the object with the error message.

      // NEED TO CALL req.login()!!!
      req.login(user, (next) => {
        return res.json('logged in');
      });
    })(req, res, next);
  }),
];
