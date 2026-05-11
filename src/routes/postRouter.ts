import express, { Router } from 'express';
import helmet from 'helmet';
import multer from 'multer';
import { getCreatePost, postCreatePost, viewPost } from '../controllers/PostController.js';
import { checkCreatePost } from '../middleware/checkCreatePost.middleware.js';

const multer_upload = multer()
const helmet_csp = helmet.contentSecurityPolicy({ directives: { "img-src": ["'self'", "data:", "blob:"] } });

export const postRouter: Router = express.Router();

postRouter.route('/post/create')
    .get(helmet_csp, getCreatePost)
    .post(multer_upload.array('files', 10), checkCreatePost, postCreatePost);

postRouter.route('/post/:id')
    .get(viewPost)
