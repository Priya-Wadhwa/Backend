const Client = require('../models/clientModel');
const Freelancer = require('../models/freelancerModel');
const Project = require('../models/projectModel');
const Category = require('../models/categoryModel')

exports.adminDashboard = async (req, res) => {
  const totalClients = await Client.countDocuments();
  const totalfreelancers = await Freelancer.countDocuments();
  const totalProjects = await Project.countDocuments();
  const totalCategory = await Category.countDocuments();


  res.send({
    success: true,
    status: 200,
    message: 'Dashboard',
    totalClients,
    totalfreelancers,
    totalProjects,
    totalCategory
  });
};
