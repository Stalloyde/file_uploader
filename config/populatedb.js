const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deleteFile = prisma.file.deleteMany();
  const deleteFolder = prisma.folder.deleteMany();

  // The transaction runs synchronously so deleteFolder must run last.
  await prisma.$transaction([deleteFile, deleteFolder]);

  await prisma.folder.create({
    data: {
      folderName: '2021',
      userId: 17,
      file: {
        create: [
          {
            fileName: 'Tenancy Agreement 2021',
            filePath: 'Demo-filepath',
            userId: 17,
          },
          {
            fileName: 'Utilities Usage Tracker',
            filePath: 'Demo-filepath',
            userId: 17,
          },
          {
            fileName: 'Home Renovations List',
            filePath: 'Demo-filepath',
            userId: 17,
          },
        ],
      },
    },
  });

  await prisma.folder.create({
    data: {
      folderName: '1983',
      userId: 17,
      file: {
        create: [
          { fileName: 'Medical Policy', filePath: 'Demo-filepath', userId: 17 },
          {
            fileName: 'Family Portrait',
            filePath: 'Demo-filepath',
            userId: 17,
          },
          {
            fileName: 'Thoughts on random matters',
            filePath: 'Demo-filepath',
            userId: 17,
          },
        ],
      },
    },
  });

  const [allUsers] = await prisma.user.findMany({
    include: {
      folder: {
        include: { file: true },
      },
    },
  });

  console.log(allUsers);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
