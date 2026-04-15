import express from 'express';
import { getHome } from '../controllers/homeController.js';

export const mainRouter = express.Router();

mainRouter.get('/', getHome);