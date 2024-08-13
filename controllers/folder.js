exports.folderGET = (req, res) => {
  res.send('Load folder page');
};

exports.fileInFolderGET = (req, res) => {
  res.send('Load file in folder page');
};

exports.createFileInFolder = (req, res) => {
  res.send('Create file in folder');
};

exports.editFileInFolder = (req, res) => {
  res.send('Edit file in folder');
};

exports.deleteFileInFolder = (req, res) => {
  res.send('Delete file in folder');
};
