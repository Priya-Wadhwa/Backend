const express = require('express');
const multer = require('multer');

const userController = require('../controllers/userController');
const clientController = require('../controllers/clientController');
const freelancerController = require('../controllers/freelancerController');
const projectController = require('../controllers/projectController');
const bidController = require('../controllers/bidController');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/login', userController.login);

const clientStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/clients/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.fieldname + '-' + file.originalname);
  },
});
const clientUpload = multer({ storage: clientStorage });
router.post('/register',  clientUpload.single('photo'), clientController.register);

router.post('/project/all', projectController.getAllProjects);
router.post('/project/single', projectController.getProject);

//Check Token
// 
router.use(require('../config/tokenChecker'));
// ---------------------------------


router.post('/change-password', userController.changePassword);



router.post(  '/update', clientUpload.single('photo'),  clientController.updateClient
);
router.post('/client-single', clientController.getClient);


//Project
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/projects/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.fieldname + '-' + file.originalname);
  },
});
const projectUpload = multer({ storage: projectStorage });
router.post('/project/create', projectUpload.single('attachment'), projectController.createProject);
router.post('/project/update',  projectUpload.single('attachment'),projectController.updateProject);
router.post('/project/delete', projectController.delete);

//Bid
router.post('/bids', bidController.getAllBids);
router.post('/bid-single', bidController.getBid);
router.post('/bid-update', bidController.clientUpdateBid);


router.post('/freelancer-single', freelancerController.getFreelancer);

//Chat
router.post('/chat', chatController.createChat);
router.post('/chat-view', chatController.viewChat);
router.post('/chat-single', chatController.singleChat);
router.post('/chat-message-delete', chatController.delMessage);

router.all('*', (req, res) => {
  res.send({
    success: false,
    status: 404,
    message: 'Invalid address!',
  });
});

module.exports = router;
