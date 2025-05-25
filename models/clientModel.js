const mongoose = require('mongoose');

const clientModel = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'user',
  },
  autoId: {
    type: Number,
    default: 0,
  },
  photo: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  companyName: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  contact: {
    type: String,
    default: '',
  },
});

const Client = mongoose.model('client', clientModel);

module.exports = Client;
