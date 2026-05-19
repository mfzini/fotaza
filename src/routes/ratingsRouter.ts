import express, { Router } from 'express';
import { getRatings, postRating } from '../controllers/ratingController.js';

export const ratingsRouter = express.Router();

ratingsRouter.route('/ratings/:fileId')
    .get(getRatings)
    .post(postRating);
