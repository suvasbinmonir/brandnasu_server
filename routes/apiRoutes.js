const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// CRUD Routes for Messages
router.get('/messages', apiController.getMessages); // GET all messages
router.get('/messages/:id', apiController.getMessage); // GET message by ID
router.post('/messages', apiController.postMessage); // POST a new message
router.put('/messages/:id', apiController.updateMessage); // PUT (update) message
router.delete('/messages/:id', apiController.deleteMessage); // DELETE message

module.exports = router;
