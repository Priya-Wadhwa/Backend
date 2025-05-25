const express = require('express');
const multer = require('multer');

const userController = require('../controllers/userController');
const clientController = require('../controllers/clientController');
const freelancerController = require('../controllers/freelancerController');
const projectController = require('../controllers/projectController');
const bidController = require('../controllers/bidController');
const chatController = require('../controllers/chatController');

const router = express.Router();

//Login
router.post('/login', userController.login);
//Register

const freelancerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/freelancers');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.fieldname + '-' + file.originalname);
  },
});
const freelancerUpload = multer({ storage: freelancerStorage });
router.post('/register',  freelancerUpload.single('photo'),freelancerController.register);
//Client
router.post('/client/all', clientController.getAllClients);
router.post('/client-single', clientController.getClient);
//Freelancer
router.post('/freelancer/all', freelancerController.getAllFreelancers);
router.post('/freelancer-single', freelancerController.getFreelancer);
//Project
router.post('/project/all', projectController.getAllProjects);
router.post('/project/single', projectController.getProject);

router.use(require('../config/tokenChecker'));

router.post('/change-password', userController.changePassword);
router.post(
  '/update',
  freelancerUpload.single('photo'),
  freelancerController.updateFreelancer
);

//Bid
const pocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/poc');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.fieldname + '-' + file.originalname);
  },
});
const pocUpload = multer({ storage: pocStorage });
router.post('/bids', bidController.getAllBids);
router.post('/bid-single', bidController.getBid);
router.post('/create-bid', pocUpload.single('poc'), bidController.createBid);
router.post('/bid-update', pocUpload.single('poc'), bidController.freelancerUpdateBid);

//Chat
router.post('/chat', chatController.createChat);
router.post('/chat-view', chatController.viewChat);
router.post('/chat-single', chatController.singleChat);

router.all('*', (req, res) => {
  res.send({
    success: false,
    status: 404,
    message: 'Invalid address!',
  });
});

module.exports = router;
