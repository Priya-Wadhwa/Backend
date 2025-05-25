const express = require('express');
const multer = require('multer');

const userController = require('../controllers/userController');
const freelancerController = require('../controllers/freelancerController');
const clientController = require('../controllers/clientController');
const projectController = require('../controllers/projectController');
const categoryController = require('../controllers/categoryController');
const bidController = require('../controllers/bidController');
// const chatController = require('../controllers/chatController');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

//Login
router.post('/login', userController.login);

router.post('/category/all', categoryController.getAllCategory);
router.post('/freelancer/single', freelancerController.getFreelancer);

//Check Token
router.use(require('../config/tokenChecker'));

router.post('/change-password', userController.changePassword);

//Freelancer
router.post('/freelancer/all', freelancerController.getAllFreelancers);
router.post('/freelancer/change-status', userController.changeStatus);

//Client
router.post('/client/all', clientController.getAllClients);
router.post('/client/single', clientController.getClient);
router.post('/client/change-status', userController.changeStatus);

//Project
router.post('/project/all', projectController.getAllProjects);
router.post('/project/single', projectController.getProject);

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/categories/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.fieldname + '-' + file.originalname);
  },
});
const categoryUpload = multer({ storage: categoryStorage });
//Category

router.post('/category/single', categoryController.getCategory);
router.post(
  '/category/create',
  categoryUpload.single('photo'),
  categoryController.createCategory
);
router.post('/category/update', categoryUpload.single('photo'),categoryController.updateCategory);
router.post('/category/change-status', categoryController.changeStatus);

router.post('/dashboard', dashboardController.adminDashboard);

//Bid
router.post('/bids', bidController.getAllBids);
router.post('/bid-single', bidController.getBid);

router.all('*', (req, res) => {
  res.send({
    success: false,
    status: 404,
    message: 'Invalid address!',
  });
});

module.exports = router;
