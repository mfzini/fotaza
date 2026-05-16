import express, { Router } from 'express';
import { getRatings, rate } from '../controllers/ratingController.js';

export const ratingsRouter = express.Router();

ratingsRouter.route('/files/rating')
    .get(getRatings)
    .post(rate);
