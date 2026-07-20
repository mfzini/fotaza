import { Router } from 'express';
import { markAsReaded, notificationsView } from '../controllers/notifications.controller.js';

export const notificationsRouter = Router();

notificationsRouter.route('/notifications')
    .get(notificationsView)
    .post(markAsReaded);