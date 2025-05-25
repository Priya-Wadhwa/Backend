const Project = require('./../models/projectModel');

exports.getAllProjects = async (req, res) => {
  Project.find(req.body)
    .sort({ createdAt: -1 })
    .populate('clientId')
    .populate('categoryId')
    .exec()
    .then((data) => {
      res.send({
        success: true,
        status: 200,
        total: data.length,
        message: 'All Projects fetched!',
        data,
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

exports.getProject = async (req, res) => {
  let validation = '';
  if (!req.body._id) {
    validation += '_id is Required  ';
  }

  if (!!validation) {
    res.send({
      success: false,
      status: 400,
      message: 'Validation Error : ' + validation,
    });
  } else {
    Project.findOne({ _id: req.body._id })
      .populate('clientId')
      .populate('categoryId')
      .exec()
      .then((data) => {
        if (data == null) {
          res.send({
            success: false,
            status: 404,
            message: 'Project does not exist',
          });
        } else {
          res.send({
            success: true,
            status: 200,
            message: 'Project fetched.',
            data,
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

exports.createProject = async (req, res) => {
  const {
    clientId,
    categoryId,
    name,
    technology,
    description,
    duration,
    budget,
  } = req.body;

  let validation = '';

  if (!clientId) {
    validation += 'clientId is Required. ';
  }
  if (!categoryId) {
    validation += 'categoryId is Required. ';
  }
  if (!name) {
    validation += 'name is Required. ';
  }
  if (!technology) {
    validation += 'technology is Required. ';
  }
  if (!description) {
    validation += 'description is Required. ';
  }
  if (!duration) {
    validation += 'duration is Required. ';
  }
  if (!budget) {
    validation += 'budget is Required. ';
  }
  if (!req.file) {
    validation += 'attachment is Required. ';
  }

  if (!!validation) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error: ' + validation,
    });
  } else {
    const totalProjects = await Project.countDocuments();
    let project = new Project();
    project.clientId = clientId;
    project.autoId = totalProjects + 1;
    project.categoryId = categoryId;
    project.name = name;
    project.technology = technology;
    project.description = description;
    project.duration = duration;
    project.budget = budget;
    project.attachment = "projects/"+req.file.filename

    project
      .save()
      .then((data) =>
        res.status(201).json({
          status: 'success',
          message: 'New project created!',
          data,
        })
      )
      .catch((err) =>
        res.send({
          success: false,
          status: 500,
          message: err.message,
        })
      );
  }
};

exports.updateProject = (req, res) => {
  let validation = '';

  if (!req.body._id) {
    validation += 'id is Required.';
  }
  if (!!validation) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error: ' + validation,
    });
  } else {
    Project.findOne({ _id: req.body._id })
      .exec()
      .then((data) => {
        if (data == null) {
          return res.send({
            success: false,
            status: 400,
            message: 'Category does not exist!',
          });
        } else {
          if (!!req.body.name) data.name = req.body.name;
          if (!!req.body.technology) data.technology = req.body.technology;
          if (!!req.body.description) data.description = req.body.description;
          if (!!req.body.budget) data.budget = req.body.budget;
          if (!!req.body.categoryId) data.categoryId = req.body.categoryId;
          if (!!req.body.duration) data.duration = req.body.duration;
          if (!!req.file) data.attachment = "projects/" + req.file.filename;

          data
            .save()
            .then((updatedData) => {
              res.send({
                success: true,
                status: 200,
                message: 'Data Updated',
                data: updatedData,
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

exports.delete = (req, res) => {
  let validation = '';
  if (!req.body._id) {
    validation += '_id is Required.';
  }

  if (!!validation) {
    res.send({
      success: false,
      status: 400,
      message: 'Validation Error : ' + validation,
    });
  } else {
    Project.findOne({ _id: req.body._id })
      .exec()
      .then((data) => {
        if (data == null) {
          res.send({
            success: false,
            status: 400,
            message: 'Project does not exist!',
          });
        } else {
          data.status = false;

          data
            .save()
            .then((updatedData) => {
              res.send({
                success: true,
                status: 200,
                message: 'project deleted',
                data: updatedData,
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
