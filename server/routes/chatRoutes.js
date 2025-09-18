import express from 'express';
import { createChat, deleteChat, getChats } from '../controllers/chatController.js';
import { protect } from '../middlewares/auth.js';

const chatRouter = express.Router();

// Protected route to create a new chat
chatRouter.get('/create', protect, createChat);
// Protected route to get all chats
chatRouter.get('/get', protect, getChats);
// Protected route to delete a chat
chatRouter.delete('/delete', protect, deleteChat);

export default chatRouter;