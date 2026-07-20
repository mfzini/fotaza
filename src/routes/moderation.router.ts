import { Router } from 'express';
import { moderationView } from '../controllers/moderation.controller.js';

export const moderationRouter = Router();

moderationRouter.route('/moderation')
    .get(moderationView)