import express, { Router } from 'express';
import multer from 'multer';
import { getCreatePost, postCreatePost, viewPost } from '../controllers/postController.js';
import { checkCreatePost } from '../middleware/checkCreatePost.middleware.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { sCleaner } from '../middleware/stringCleaner.js';

const multer_upload = multer()
export const postRouter: Router = express.Router();

postRouter.route('/post/create')
    .get(isAuthenticated, getCreatePost)
    .post(isAuthenticated, multer_upload.array('files', 10), sCleaner, checkCreatePost, postCreatePost);

postRouter.route('/post/:id')
    .get(viewPost)
