const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

exports.homepage = (req, res, next) => {
  res.json('Load Homepage');
};

exports.createFolder = (req, res, next) => {
  res.send('Create folder');
};

exports.createFile = (req, res, next) => {
  res.send('Create File');
};
