const Category = require('./../models/categoryModel');

exports.getAllCategory = (req, res) => {
  req.body.status = true;
  Category.find(req.body)
    .exec()
    .then((categoryData) => {
      res.send({
        success: true,
        status: 200,
        message: 'All Categories found!',
        data: categoryData
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

exports.getCategory = (req, res) => {
  let validation = '';

  if (!req.body._id) {
    validation += 'id is required.';
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    Category.findOne({ _id: req.body._id })
      .exec()
      .then((categoryData) => {
        if (categoryData == null) {
          return res.send({
            success: false,
            status: 404,
            message: 'Category does not exist!',
          });
        } else {
          return res.send({
            success: true,
            status: 200,
            message: 'Category found!',
            data: categoryData
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

exports.createCategory = async (req, res) => {
  let validation = '';

  if (!req.body.name) {
    validation += 'Category name is required.';
  }
  if (!req.file) {
    validation += 'Category photo is required.';
  }
  if (!!validation) {
    res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    const totalCategory = await Category.countDocuments();
    const { name } = req.body;
    // console.log(req.file);
    let category = new Category();
    category.autoId = totalCategory + 1;
    category.name = name;
    category.photo = 'categories/' + req.file.filename;

    category
      .save()
      .then((newCategory) => {
        res.send({
          success: true,
          status: 201,
          message: 'New category created!!',
          data: {
            category: newCategory,
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
};

exports.updateCategory = (req, res) => {
  let validation = '';

  if (!req.body._id) {
    validation += 'id is required.';
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    Category.findOne({ _id: req.body._id })
      .exec()
      .then(async (categoryData) => {
        if (categoryData == null) {
          res.send({
            success: false,
            status: 404,
            message: 'Category does not exists!',
          });
        } else {
          if (!!req.body.name) {
            categoryData.name = req.body.name;
          }
          if (!!req.file) {
            categoryData.photo = "categories/" + req.file.filename;
          }
          const prevCategory = await Category.findOne({
            $and: [{ _id: { $ne: req.body._id } }, { name: req.body.name }],
          });
          if (!prevCategory) {
            categoryData
              .save()
              .then((updatedCategory) => {
                res.send({
                  success: true,
                  status: 200,
                  message: 'Category updated!',
                  data: {
                    category: updatedCategory,
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
          } else {
            return res.send({
              success: false,
              status: 400,
              message: 'Category already exist!',
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
    validation += 'id is required.';
  }

  if (!!validation) {
    res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    Category.findOne({ _id: req.body._id })
      .exec()
      .then((categoryData) => {
        if (categoryData == null) {
          res.send({
            success: false,
            status: 404,
            message: 'Category does not exist!',
          });
        } else {
          categoryData.status = false;

          categoryData
            .save()
            .then((deletedCategory) => {
              res.send({
                success: true,
                status: 200,
                message: 'Category deleted!',
                data: {
                  category: deletedCategory,
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
