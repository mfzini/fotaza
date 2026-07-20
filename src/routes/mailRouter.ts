import { Router } from 'express';
import { mailView, markAsReaded, sendMail } from '../controllers/mailController.js';

export const mailRouter = Router();

mailRouter.route('/mail')
    .get(mailView)
    .post(sendMail);
mailRouter.route('/mail/:id').patch(markAsReaded);