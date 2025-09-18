import express from "express";
import { getPublishedImages, getUser, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

// Register route
userRouter.post('/register', registerUser);

// Login route
userRouter.post('/login', loginUser);

// Protected route (requires valid JWT)
userRouter.get('/data', protect, getUser);
userRouter.get('/published-images', getPublishedImages);
     
export default userRouter;
