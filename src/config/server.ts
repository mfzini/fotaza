import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { mainRouter } from '../routes/mainRouter.js';
import { redisStore } from './redis.js';
import session from 'express-session';
import passport from 'passport';
import './passport.js';
import { catchAll } from '../controllers/mainController.js';
import { setUserContext } from '../middleware/setUserContext.js';
export const server = express();
server.use(helmet());

server.use(session({
    name: 'jwt',
    secret: process.env.SESSION_SECRET!,
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
server.use(passport.initialize());
server.use(passport.session());

server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(import.meta.dirname, '..', '..', 'static')));
server.set('view engine', 'pug');
server.set('views', path.join(import.meta.dirname, "..", "..", 'views'));
server.use(setUserContext)
server.use(mainRouter);
server.use(catchAll);