import express from 'express';
import { mainRouter } from './routes/mainRouter.js';
export const server = express();

server.set('view engine', 'pug');

server.use(mainRouter);
