import { Router } from "express";
import { getProfile } from "../controllers/userController.js";

export const userRouter = Router();

userRouter.get(['/profile', '/profile/:id'], getProfile);