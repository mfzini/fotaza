import express, { Router } from 'express';
import { makeComment } from '../controllers/commentController.js';

export const commentsRouter: Router = express.Router();

commentsRouter.route('/comment/:fileId')
    .post(makeComment);