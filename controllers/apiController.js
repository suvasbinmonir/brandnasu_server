// let messages = [
//     { id: 1, content: 'Hello from the server!' },
//     { id: 2, content: 'Welcome to the API!' }
//   ];

  const Message = require('../models/Message');
  
  // GET all messages
  const getMessages = async (req, res) => {
    try {
      const messages = await Message.find();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // GET a single message by id
  const getMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const message = await Message.findById(id);
  
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // POST a new message
  const postMessage = async (req, res) => {
    try {
      const { content } = req.body;
  
      if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
      }
  
      const newMessage = await Message.create({ content });
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // PUT (Update) a message by id
  const updateMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
  
      const updatedMessage = await Message.findByIdAndUpdate(
        id,
        { content },
        { new: true, runValidators: true }
      );
  
      if (!updatedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  // DELETE a message by id
  const deleteMessage = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedMessage = await Message.findByIdAndDelete(id);
  
      if (!deletedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    getMessages,
    getMessage,
    postMessage,
    updateMessage,
    deleteMessage
  };
  