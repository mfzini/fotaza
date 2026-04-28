import express from 'express';
import path from 'path';
import { mainRouter } from './routes/mainRouter.js';
export const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.set('view engine', 'pug');
server.set('views', path.join(import.meta.dirname, "..", 'views'));
server.use(mainRouter);
