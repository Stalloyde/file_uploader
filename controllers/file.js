const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.allFilesGET = async (req, res, next) => {
  try {
    const allFiles = await prisma.file.findMany({
      where: { userId: req.user.id },
      orderBy: { fileName: 'asc' },
    });
    return res.json(allFiles);
  } catch (err) {
    return res.json(err);
  }
};

exports.fileGET = (req, res, next) => {
  res.json('Load file page');
};

exports.createFile = (req, res, next) => {
  res.json('Create file');
};

exports.editFile = (req, res, next) => {
  res.json('Edit file');
};

exports.deleteFile = (req, res, next) => {
  res.json('Delete file');
};
