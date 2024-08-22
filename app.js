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
const MemoryStore = require('memorystore')(session);

const signUpRouter = require('./routes/signup');
const logInRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const folderRouter = require('./routes/folder');
const fileRouter = require('./routes/file');

const app = express();

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
    },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
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
