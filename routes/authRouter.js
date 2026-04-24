import express from 'express';
import { getLogin, getSignUp, postSignUp } from '../controllers/authController.js';

export const authRouter = express.Router();

authRouter.route('/signup')
    .get(getSignUp)
    .post(postSignUp);

authRouter.route('/login')
    .get(getLogin)