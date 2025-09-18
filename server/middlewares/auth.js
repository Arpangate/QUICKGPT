import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  try {
    // 1. Verify token with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Extract user id from decoded payload
    const userId = decoded.id;

    // 3. Find user by id in MongoDB
    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "Not authorized, user not found"
      });
    }

    // 4. Attach user to request
    req.user = user;

    // Continue to the next middleware/route
    next();
  } catch (error) {
      res.status(401).json({message: "Not authorized, token failed"});
  }
};

