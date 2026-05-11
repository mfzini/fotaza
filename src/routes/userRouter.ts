import { Router } from "express";
import { getProfile, getProfileById } from "../controllers/userController.js";

export const userRouter = Router();

userRouter.get('/profile', getProfile)
userRouter.get('/profile/:id', getProfileById);