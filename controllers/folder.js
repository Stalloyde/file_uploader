const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.allFoldersGET = async (req, res) => {
  const allFolders = await prisma.folder.findMany({
    where: { userId: req.user.id },
    orderBy: { folderName: 'asc' },
  });
  return res.json(allFolders);
};

exports.folderGET = async (req, res) => {
  const targetId = parseInt(req.params.folderId);

  const [filesInTargetFolder, targetFolder] = await prisma.$transaction([
    prisma.file.findMany({
      where: { folderId: targetId },
      orderBy: { fileName: 'asc' },
    }),
    prisma.folder.findUnique({
      where: { id: targetId },
    }),
  ]);

  return res.json({
    filesInTargetFolder,
    targetFolder,
  });
};

exports.createFolder = [
  body('newFolderName')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('*Input cannot be empty or only whitespace'),

  expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const newFolder = await prisma.folder.create({
      data: {
        folderName: req.body.newFolderName,
        userId: req.user.id,
      },
    });
    return res.json(newFolder);
  }),
];

exports.editFolder = [
  body('newFolderName')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('*Input cannot be empty or only whitespace'),

  expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: req.body.targetFolder.id },
      data: { folderName: req.body.newFolderName },
    });
    return res.json(updatedFolder);
  }),
];

exports.deleteFolder = [
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.targetFolder);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    await prisma.folder.delete({
      where: { id: req.body.targetFolder.id },
    });
    return res.json('Deleted');
  }),
];

exports.fileInFolderGET = (req, res) => {
  res.json('Load file in folder page');
};

exports.createFileInFolder = (req, res) => {
  res.json('Create file in folder');
};

exports.editFileInFolder = (req, res) => {
  console.log('asodnasodanskodn');
  res.json('Edit file in folder');
};

exports.deleteFileInFolder = (req, res) => {
  res.json('Delete file in folder');
};
