import express from 'express';
import { getRatings, postRating } from '../controllers/ratingController.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

export const ratingsRouter = express.Router();

ratingsRouter.route('/ratings/:fileId')
    .get(getRatings)
    .post(isAuthenticated, postRating);
