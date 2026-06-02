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
const [storageDomain] = process.env.S3_BUCKET!.split('/storage');
const mediaDirectives = ["'self'", "data:", "blob:", storageDomain ?? '']
server.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": mediaDirectives,
            'media-src': mediaDirectives,
        }
    }
}));

server.use(session({
    name: 'jwt',
    secret: process.env.SESSION_SECRET!,
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV == 'production',
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
server.use(passport.initialize());
server.use(passport.session());

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(path.join(import.meta.dirname, '..', '..', 'static')));
server.set('view engine', 'pug');
server.set('views', path.join(import.meta.dirname, "..", "..", 'views'));
server.use(setUserContext)
server.use(mainRouter);
server.use(catchAll);