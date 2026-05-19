import express, { Router } from 'express';
import { fetchComments, makeComment } from '../controllers/commentController.js';

export const commentsRouter: Router = express.Router();

commentsRouter.route('/comments/:fileId')
    .get(fetchComments)
    .post(makeComment);