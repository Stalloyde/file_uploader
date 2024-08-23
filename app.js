require('dotenv').config();
require('./config/passport');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const RateLimit = require('express-rate-limit');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

const signUpRouter = require('./routes/signup');
const logInRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const folderRouter = require('./routes/folder');
const fileRouter = require('./routes/file');

const app = express();

// Trust the first proxy (useful for production setups behind proxies)
app.set('trust proxy', 1);

const corsOptions = {
  origin: ['https://file-uploader-client.vercel.app', 'http://localhost:5173'],
  optionsSuccessStatus: 200,
  credentials: true,
};

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300,
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(limiter);
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(corsOptions));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
      sameSite: 'none',
      secure: (process.env.NODE_ENV = 'production'),
    },
    // store: new PrismaSessionStore(new PrismaClient(), {
    //   checkPeriod: 2 * 60 * 1000, //ms
    //   dbRecordIdIsSessionId: true,
    //   dbRecordIdFunction: undefined,
    // }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', homeRouter);
app.use('/signup', signUpRouter);
app.use('/login', logInRouter);
app.use('/folder', folderRouter);
app.use('/file', fileRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log(err);
  if (err.code === 'P2002') {
    return res.json({ errors: [{ msg: '*Name is taken. Try another.' }] });
  }

  if (err.message === 'Unsupported ZIP file') {
    return res.json({
      errors: [
        {
          msg: '*File format not supported. Only (.png/.jpeg/.jpg) are supported.',
        },
      ],
    });
  }

  return res.json({
    errors: [{ msg: '*Something went wrong. Refresh page and try again.' }],
  });
});
module.exports = app;
