const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { format } = require('date-fns');

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

exports.targetFileGET = async (req, res, next) => {
  const targetId = Number(req.params.fileId);
  try {
    const targetFile = await prisma.file.findUnique({
      where: { id: targetId },
      include: {
        user: {
          select: { username: true },
        },
        folder: true,
      },
    });
    targetFile.createdAt = format(
      new Date(targetFile.createdAt),
      'dd-MMM-yyyy',
    );
    return res.json(targetFile);
  } catch (err) {
    return res.json(err);
  }
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
