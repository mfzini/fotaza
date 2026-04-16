import express from 'express';
import { mainRouter } from './routes/mainRouter.js';
export const server = express();

server.use(express.urlencoded({extended: true}));
server.set('view engine', 'pug');

server.use(mainRouter);
