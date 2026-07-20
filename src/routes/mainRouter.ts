import express, { Router, type NextFunction, type Request, type Response } from 'express';
import { getHome } from '../controllers/mainController.js';
import { authRouter } from './authRouter.js';
import { postRouter } from './postRouter.js';
import { userRouter } from './userRouter.js';
import { ratingsRouter } from './ratingsRouter.js';
import { commentsRouter } from './commentsRouter.js';
import { collectionsRouter } from './collections.router.js';
import { reportsRouter } from './reportsRouter.js';
import { mailRouter } from './mailRouter.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { notificationsRouter } from './notifications.router.js';
import { moderationRouter } from './moderation.router.js';
import { searchRouter } from './searchRouter.js';

export const mainRouter: Router = express.Router();
mainRouter.get('/', getHome);
mainRouter.use(authRouter);
mainRouter.use(postRouter);
mainRouter.use(isAuthenticated, userRouter);
mainRouter.use(ratingsRouter);
mainRouter.use(isAuthenticated, commentsRouter);
mainRouter.use(isAuthenticated, collectionsRouter);
mainRouter.use(isAuthenticated, reportsRouter);
mainRouter.use(isAuthenticated, mailRouter);
mainRouter.use(isAuthenticated, notificationsRouter);
mainRouter.use(isAuthenticated, moderationRouter);
mainRouter.use(searchRouter);

mainRouter.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Página no encontrada: ${req.originalUrl}`);
    res.status(404);
    next(error);
});