const User = require('./../models/userModel');
const Client = require('./../models/clientModel');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  let validation = '';
  if (!req.body.name) {
    validation += 'Name is required. ';
  }
  if (!req.body.email) {
    validation += 'Email is required. ';
  }
  if (!req.body.password) {
    validation += 'Password is required. ';
  }
  if (!req.body.companyName) {
    validation += 'Company name is required. ';
  }
  if (!req.body.address) {
    validation += 'Address is required. ';
  }
  if (!req.body.country) {
    validation += 'Country is required. ';
  }
  if (!req.body.contact) {
    validation += 'Contact is required. ';
  }
  if (!req.file) {
    validation += 'Photo is required. ';
  }

  if (!!validation) {
    res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    let prevUser = await User.findOne({ email: req.body.email })
    if (prevUser == null) {

      const totalUser = await User.countDocuments();
      let user = new User();
      user.autoId = totalUser + 1;
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.userType = 2;

      user
        .save()
        .then(async (userData) => {
          const clientTotal = await Client.countDocuments();
          let client = new Client();
          client.userId = userData._id;
          client.autoId = clientTotal + 1;
          client.name = req.body.name;
          client.email = req.body.email;
          client.companyName = req.body.companyName;
          client.address = req.body.address;
          client.country = req.body.country;
          client.contact = req.body.contact;
          client.photo = "clients/" + req.file.filename;

          client
            .save()
            .then((clientData) => {
              res.send({
                success: true,
                status: 201,
                message: 'New client registered!',
                data: {
                  client: clientData,
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
        })
        .catch((err) => {
          res.send({
            success: false,
            status: 500,
            message: err.message,
          });
        });
    }
    else {
      res.send({
        success: false,
        status: 400,
        message: "Email Alreay exists",
      });
    }
  }
};

exports.getAllClients = (req, res) => {
  Client.find(req.body)
    .populate('userId')
    .exec()
    .then(async (clients) => {
      const total = await Client.countDocuments();
      res.send({
        success: true,
        status: 200,
        total,
        message: 'All clients found!!',
        data: {
          clients,
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
};

exports.getClient = (req, res) => {
  let validation = '';
  if (!req.body._id) {
    validation = 'id is required. ';
  }

  if (!!validation) {
    res.send({
      success: true,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    Client.findOne({ userId: req.body._id })
      .populate('userId')
      .exec()
      .then((clientData) => {
        if (clientData == null) {
          return res.send({
            success: false,
            status: 404,
            message: 'Client does not exist!',
          });
        } else {
          return res.send({
            success: true,
            status: 200,
            message: 'Client found!',
            data: {
              client: clientData,
            },
          });
        }
      });
  }
};

exports.updateClient = (req, res) => {
  let validation = '';
  console.log(req);
  if (!req.body._id) {
    validation += 'id is required. ';
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
      .then(async (userData) => {
        if (userData == null) {
          return res.send({
            success: false,
            status: 404,
            message: 'User not found!',
          });
        } else {
          if (!!req.body.name) {
            userData.name = req.body.name;
          }
          if (!!req.body.email) {
            userData.email = req.body.email;
          }
          const prevUser = await User.findOne({
            $and: [{ _id: { $ne: req.body._id } }, { email: req.body.email }],
          });
          if (!prevUser) {
            userData
              .save()
              .then((updatedUser) => {
                Client.findOne({ userId: updatedUser._id })
                  .exec()
                  .then((clientData) => {
                    if (clientData == null) {
                      return res.send({
                        success: false,
                        status: 404,
                        id: updatedUser._id,
                        message: 'Client not found!',
                      });
                    } else {
                      if (!!req.body.name) {
                        clientData.name = req.body.name;
                      }
                      if (!!req.body.email) {
                        clientData.email = req.body.email;
                      }
                      if (!!req.body.contact) {
                        clientData.contact = req.body.contact;
                      }
                      if (!!req.body.country) {
                        clientData.country = req.body.country;
                      }
                      if (!!req.body.companyName) {
                        clientData.companyName = req.body.companyName;
                      }
                      if (!!req.body.address) {
                        clientData.address = req.body.address;
                      }
                      if (!!req.file) {
                        clientData.photo = 'clients/' + req.file.filename;
                      }
                      clientData
                        .save()
                        .then((updatedClient) => {
                          res.send({
                            success: true,
                            status: 200,
                            message: 'Client Updated!',
                            data: {
                              client: updatedClient,
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
              message: 'Client already exist!',
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
