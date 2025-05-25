const jwt = require('jsonwebtoken');
const SECRET = 'this-is-ultra-secret-@#$%^%$#@QSDFGT';

const checkToken = (req, res, next) => {
  const token = req.headers['authorization'];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.send({
        success: 'false',
        status: 403,
        message: 'Invalid Token.',
      });
    } else {
      next();
    }
  });
};

module.exports = checkToken;
