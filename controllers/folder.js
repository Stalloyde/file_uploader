const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadImage, deleteImages } = require('../config/cloudinary');

exports.allFoldersGET = expressAsyncHandler(async (req, res) => {
  const allFolders = await prisma.folder.findMany({
    where: { userId: req.user.id },
    orderBy: { folderName: 'asc' },
  });
  return res.json(allFolders);
});

exports.folderGET = expressAsyncHandler(async (req, res) => {
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
});

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
    const associatedFiles = await prisma.file.findMany({
      where: { folderId: req.body.targetFolder.id },
      select: {
        public_id: true,
      },
    });

    const public_ids = associatedFiles
      .map((file) => {
        if (file.public_id !== null) return file.public_id;
      })
      .filter((elem) => elem !== undefined);

    await Promise.all([
      prisma.folder.delete({
        where: { id: req.body.targetFolder.id },
      }),
      deleteImages(public_ids),
    ]);

    return res.json('Deleted folder');
  }),
];

exports.createFileInFolder = expressAsyncHandler(async (req, res) => {
  if (req.file) {
    const uploadedFile = await uploadImage(req.file.path);

    const newFile = await prisma.file.create({
      data: {
        fileName: req.file.originalname,
        filePath: uploadedFile.url,
        userId: req.user.id,
        folderId: Number(req.params.folderId),
        public_id: uploadedFile.public_id,
      },
    });
    res.json(`Created ${newFile.fileName} in ${req.params.folderId}`);
  }
});
