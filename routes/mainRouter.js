import express from 'express';
import { getHome } from '../controllers/mainController.js';
import { authRouter } from './authRouter.js';

export const mainRouter = express.Router();

mainRouter.get('/', getHome);
mainRouter.use(authRouter);