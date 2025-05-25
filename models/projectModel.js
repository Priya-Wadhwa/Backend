const mongoose = require('mongoose');

const projectModel = mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'user',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'category',
  },
  autoId: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: '',
  },
  technology: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: 0,
  },
  budget: {
    type: String,
    default: 0,
  },
  attachment: {
    type: String,
    default: '',
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

const Project = mongoose.model('project', projectModel);

module.exports = Project;
