import { Router } from "express";
import { follow, getProfile } from "../controllers/userController.js";

export const userRouter = Router();

userRouter.get(['/profile', '/profile/:id'], getProfile);
userRouter.post('/follow/:id', follow)