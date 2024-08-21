const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { format } = require('date-fns');
const { deleteImage } = require('../config/cloudinary');

exports.allFilesGET = expressAsyncHandler(async (req, res) => {
  try {
    const allFiles = await prisma.file.findMany({
      where: { userId: req.user.id },
      orderBy: { fileName: 'asc' },
    });
    return res.json(allFiles);
  } catch (err) {
    return res.json(err);
  }
});

exports.targetFileGET = expressAsyncHandler(async (req, res) => {
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
});

exports.editFile = [
  body('newFileName')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('*Input cannot be empty or only whitespace'),

  expressAsyncHandler(async (req, res) => {
    const targetId = Number(req.params.fileId);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const updatedFile = await prisma.file.update({
      where: { id: targetId },
      data: { fileName: req.body.newFileName },
    });
    return res.json(updatedFile);
  }),
];

exports.deleteFile = expressAsyncHandler(async (req, res) => {
  const targetFileId = Number(req.params.fileId);
  const { public_id } = await prisma.file.findUnique({
    where: { id: targetFileId },
    select: {
      public_id: true,
    },
  });

  await Promise.all([
    prisma.file.delete({
      where: { id: targetFileId },
    }),
    deleteImage(public_id),
  ]);
  res.json('Deleted file');
});
