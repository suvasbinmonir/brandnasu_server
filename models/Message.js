const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
