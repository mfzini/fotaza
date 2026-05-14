import express, { Router } from 'express';
import { getRatings } from '../controllers/ratingController.js';

export const ratingsRouter = express.Router();

ratingsRouter.route('/ratings')
    .get(getRatings);
