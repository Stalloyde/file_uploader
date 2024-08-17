const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

exports.signup = [
  body('username').trim().notEmpty().escape().withMessage('*Username required'),
  body('password').trim().notEmpty().escape().withMessage('*Password required'),
  body('confirmPassword')
    .notEmpty()
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .escape()
    .withMessage('Passwords do not match'),

  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const jsonErrorResponses = {
      usernameError: null,
      passwordError: null,
      confirmPasswordError: null,
    };

    if (!errors.isEmpty()) {
      const errorsArray = errors.array();

      errorsArray.forEach((error) => {
        if (error.path === 'username') {
          jsonErrorResponses.usernameError = error.msg;
        } else if (error.path === 'password') {
          jsonErrorResponses.passwordError = error.msg;
        } else {
          jsonErrorResponses.confirmPasswordError = error.msg;
        }
      });
      return res.json(jsonErrorResponses);
    }

    try {
      const a = await prisma.user.findMany();
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
        },
      });

      return res.json('Sign up successful!');
    } catch (e) {
      if (e.code === 'P2002') {
        jsonErrorResponses.usernameError =
          'Username has been taken. Try another.';
        return res.json(jsonErrorResponses);
      }
      return res.json(e);
    }
  }),
];
