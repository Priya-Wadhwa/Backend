const mongoose = require('mongoose');

const userModel = mongoose.Schema({
  autoId: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  userType: {
    type: Number,
    default: 3, //* 1.Admin, 2.Client, 3.Freelancer
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model('user', userModel);

module.exports = User;
