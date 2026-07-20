import express, { Router } from 'express';
import { deleteComment, makeComment } from '../controllers/commentController.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

export const commentsRouter: Router = express.Router();

commentsRouter.route('/comments/:fileId')
    .post(makeComment);
commentsRouter.route('/comments/:commentId')
    .delete(deleteComment);