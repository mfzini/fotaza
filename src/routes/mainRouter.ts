import express, { Router } from 'express';
import { getHome } from '../controllers/mainController.js';
import { authRouter } from './authRouter.js';
import { postRouter } from './postRouter.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { userRouter } from './userRouter.js';
import { ratingsRouter } from './ratingsRouter.js';
import { commentsRouter } from './commentsRouter.js';
import { search } from '../controllers/searchController.js';

export const mainRouter: Router = express.Router();
mainRouter.get('/', getHome);
mainRouter.use(authRouter);
mainRouter.use(postRouter);
mainRouter.use(userRouter);
mainRouter.use(ratingsRouter);
mainRouter.use(commentsRouter);
mainRouter.post('/search', search);
