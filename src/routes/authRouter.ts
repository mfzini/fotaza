import express, { Router } from 'express';
import { getLogin, getSignUp, postLogin, postSignUp } from '../controllers/authController.js';

export const authRouter: Router = express.Router();

authRouter.route('/signup')
    .get(getSignUp)
    .post(postSignUp);

authRouter.route('/login')
    .get(getLogin)
    .post(postLogin)