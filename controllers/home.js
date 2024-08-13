exports.signup = (req, res, next) => {
  res.send('POST signup Page');
};

exports.login = (req, res, next) => {
  res.send('POST Login Page');
};

exports.homepage = (req, res, next) => {
  res.send('Load Homepage');
};

exports.createFolder = (req, res, next) => {
  res.send('Create folder');
};

exports.createFile = (req, res, next) => {
  res.send('Create File');
};
