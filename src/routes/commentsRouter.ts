import express, { Router } from 'express';
import { fetchComments, makeComment } from '../controllers/commentController.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

export const commentsRouter: Router = express.Router();

commentsRouter.route('/comments/:fileId')
    .get(fetchComments)
    .post(isAuthenticated, makeComment);