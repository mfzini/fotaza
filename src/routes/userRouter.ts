import { Router } from "express";
import { follow, getProfile, interested } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

export const userRouter = Router();

userRouter.get(['/profile', '/profile/:id'], getProfile);
userRouter.post('/follow/:id', isAuthenticated, follow)
userRouter.post('/interested/:fileId', isAuthenticated, interested);