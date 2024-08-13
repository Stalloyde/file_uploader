exports.fileGET = (req, res, next) => {
  res.send('Load file page');
};

exports.createFile = (req, res, next) => {
  res.send('Create file');
};

exports.editFile = (req, res, next) => {
  res.send('Edit file');
};

exports.deleteFile = (req, res, next) => {
  res.send('Delete file');
};
