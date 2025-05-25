const User = require('./../models/userModel');
const Freelancer = require('./../models/freelancerModel');
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
  if (!req.body.contact) {
    validation += 'Contact is required. ';
  }
  if (!req.body.categoryId) {
    validation += 'CategoryId is required. ';
  }
  if (!req.file) {
    validation += 'Photo Required. ';
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    let prevUser = await User.findOne({email:req.body.email})
    if(prevUser == null){
      const totalUser = await User.countDocuments();
      let user = new User();
      user.autoId = totalUser + 1;
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password, 10);

      user
        .save()
        .then(async (userData) => {
          const totalFreelancer = await Freelancer.countDocuments();
          let freelancer = new Freelancer();
          freelancer.userId = userData._id;
          freelancer.autoId = totalFreelancer + 1;
          freelancer.name = req.body.name;
          freelancer.email = req.body.email;
          freelancer.contact = req.body.contact;
          freelancer.categoryId = req.body.categoryId;
          freelancer.photo ="freelancers/"+ req.file.filename;

          freelancer
            .save()
            .then((freelancerData) => {
              res.send({
                success: true,
                status: 201,
                message: 'New freelancer registered!',
                data: {
                  freelancer: freelancerData,
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
      else{
        res.send({
          success: false,
          status: 400,
          message: "Email Already Exists",
        });
      }
  }
};

exports.getAllFreelancers = (req, res) => {
  Freelancer.find(req.body)
    .populate('userId')
    .populate('categoryId')
    .exec()
    .then(async (freelancers) => {
      const total = await Freelancer.countDocuments();
      res.send({
        success: true,
        status: 200,
        total,
        message: 'All freelancers found!',
        data: {
          freelancers,
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

exports.getFreelancer = (req, res) => {
  let validation = '';

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
    Freelancer.findOne({ userId: req.body._id })
      .populate('userId')
      .populate('categoryId')
      .exec()
      .then((freelancerData) => {
        if (freelancerData == null) {
          return res.send({
            success: false,
            status: 404,
            message: 'Freelancer does not exist!',
          });
        } else {
          return res.send({
            success: true,
            status: 200,
            message: 'Freelancer found!',
            data: {
              freelancer: freelancerData,
            },
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

exports.updateFreelancer = (req, res) => {
  let validation = '';

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
                Freelancer.findOne({ userId: updatedUser._id })
                  .exec()
                  .then((freelancerData) => {
                    if (freelancerData == null) {
                      return res.send({
                        success: false,
                        status: 404,
                        id: updatedUser._id,
                        message: 'Freelancer not found!',
                      });
                    } else {
                      if (!!req.body.name) {
                        freelancerData.name = req.body.name;
                      }
                      if (!!req.body.email) {
                        freelancerData.email = req.body.email;
                      }
                      if (!!req.body.contact) {
                        freelancerData.contact = req.body.contact;
                      }
                      if (!!req.body.categoryId) {
                        freelancerData.categoryId = req.body.categoryId;
                      }
                      if (!!req.file)
                        freelancerData.photo =
                          'freelancers/' + req.file.filename;
                      freelancerData
                        .save()
                        .then((updatedFreelancer) => {
                          res.send({
                            success: true,
                            status: 200,
                            message: 'Freelancer Updated!',
                            data: {
                              freelancer: updatedFreelancer,
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
              message: 'User email already exist!',
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
