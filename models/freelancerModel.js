const mongoose = require('mongoose');

const freelancerModel = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'user',
  },
  autoId: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    default: 'freelancers/noImg.jpg',
  },
  email: {
    type: String,
    default: '',
  },
  contact: {
    type: String,
    default: '',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'category',
  },
});

const Freelancer = mongoose.model('freelancer', freelancerModel);

module.exports = Freelancer;
