import express from 'express';
import { protect } from '../middlewares/auth.js';
import { imageMessageController, textMessageController } from '../controllers/messageController.js';

const messageRouter = express.Router();

// Route for sending text messages
messageRouter.post('/text', protect, textMessageController);

// Route for sending image messages
messageRouter.post('/image', protect, imageMessageController);

export default messageRouter;
