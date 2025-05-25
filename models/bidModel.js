const mongoose = require('mongoose');

const bidModel = mongoose.Schema({
  autoId: {
    type: Number,
    default: 0,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'user',
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'project',
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'user',
  },
  bidAmount: {
    type: String,
    default: "",
  },
  poc: {
    type: String,
    default: 'poc/noImg.jpg',
  },
  description: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'Pending',
  },
});

const Bid = mongoose.model('bid', bidModel);

module.exports = Bid;
