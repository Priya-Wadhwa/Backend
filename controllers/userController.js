const User = require('./../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = 'this-is-ultra-secret-@#$%^%$#@QSDFGT';

exports.login = (req, res) => {
  let validation = '';

  if (!req.body.email) {
    validation += 'Email is required. ';
  }
  if (!req.body.password) {
    validation += 'Password is required. ';
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    User.findOne({ email: req.body.email })
      .exec()
      .then((userData) => {
        if (userData == null) {
          return res.send({
            success: false,
            status: 404,
            message: 'User account does not exist',
          });
        } else {
          if (bcrypt.compareSync(req.body.password, userData.password)) {
            if (userData.status) {
              const payload = {
                name: userData.name,
                email: userData.email,
              };
              const token = jwt.sign(payload, SECRET, { expiresIn: '5h' });
              return res.send({
                success: true,
                status: 200,
                message: 'Login successful!',
                data: {
                  user: userData,
                },
                token,
              });
            } else {
              return res.send({
                success: false,
                status: 403,
                message: 'Account inactive!',
              });
            }
          } else {
            return res.send({
              success: false,
              status: 401,
              message: 'Incorrect passsword!',
            });
          }
        }
      })
      .catch((err) => {
        res.send({
          success: false,
          status: 500,
          message: err.message,
        });
      });
  }
};

exports.changePassword = (req, res) => {
  let validation = '';

  if (!req.body._id) {
    validation += 'id is required. ';
  }
  if (!req.body.currentPassword) {
    validation += 'Current Password is required. ';
  }
  if (!req.body.newPassword) {
    validation += 'New Password is required. ';
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    User.findOne({ _id: req.body._id })
      .exec()
      .then((userData) => {
        if (userData == null) {
          return res.send({
            success: false,
            status: 404,
            message: 'User not found!',
          });
        } else {
          if (bcrypt.compareSync(req.body.currentPassword, userData.password)) {
            userData.password = bcrypt.hashSync(req.body.newPassword, 10);

            userData
              .save()
              .then(() => {
                res.send({
                  success: true,
                  status: 200,
                  message: 'Password updated!',
                });
              })
              .catch((err) => {
                res.send({
                  success: false,
                  status: 500,
                  message: err.message,
                });
              });
          } else {
            return res.send({
              success: false,
              status: 400,
              message: 'Invalid Password!',
            });
          }
        }
      })
      .catch((err) => {
        res.send({
          success: false,
          status: 500,
          message: err.message,
        });
      });
  }
};

exports.changeStatus = (req, res) => {
  let validation = '';

  if (!req.body._id) {
    validation += 'id is required. ';
  }
  if (!req.body.status) {
    validation += 'status is required. ';
  }
  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    User.findOne({ _id: req.body._id })
      .exec()
      .then((user) => {
        if (user == null) {
          return res.send({
            success: false,
            status: 400,
            message: 'User not found!',
          });
        } else {
          user.status = req.body.status;

          user
            .save()
            .then((updatedUser) => {
              res.send({
                success: true,
                status: 200,
                message: 'User Status Updated!',
                data: {
                  user: updatedUser,
                },
              });
            })
            .catch((err) => {
              res.send({
                success: false,
                status: 500,
                message: err.message,
              });
            });
        }
      })
      .catch((err) => {
        res.send({
          success: false,
          status: 500,
          message: err.message,
        });
      });
  }
};
