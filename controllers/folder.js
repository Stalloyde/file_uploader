const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.allFoldersGET = async (req, res) => {
  try {
    const allFolders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      orderBy: { folderName: 'asc' },
    });
    return res.json(allFolders);
  } catch (err) {
    return res.json(err);
  }
};

exports.folderGET = async (req, res) => {
  const targetId = parseInt(req.params.folderId);

  try {
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
  } catch (err) {
    return res.json(err);
  }
};

exports.createFolder = (req, res) => {
  res.json('Create folder');
};

exports.fileInFolderGET = (req, res) => {
  res.json('Load file in folder page');
};

exports.createFileInFolder = (req, res) => {
  res.json('Create file in folder');
};

exports.editFileInFolder = (req, res) => {
  res.json('Edit file in folder');
};

exports.deleteFileInFolder = (req, res) => {
  res.json('Delete file in folder');
};
