require('dotenv').config();
require('./config/passport');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const signUpRouter = require('./routes/signup');
const logInRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const folderRouter = require('./routes/folder');
const fileRouter = require('./routes/file');

const app = express();

const corsOptions = {
  origin: [
    //add production url
    'http://localhost:5173',
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', homeRouter);
app.use('/signup', signUpRouter);
app.use('/login', logInRouter);
app.use('/folders', folderRouter);
app.use('/files', fileRouter);

module.exports = app;
