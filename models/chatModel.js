const mongoose = require('mongoose');

const chatModel = mongoose.Schema({
  autoId: {
    type: Number,
    default: 0,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'user',
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'user',
  },
  messages: [
    {
      fromId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'user',
      },
      message: {
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
    },
  ],
});

const Chat = mongoose.model('chat', chatModel);

module.exports = Chat;
