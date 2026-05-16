import express, { Router } from 'express';
import multer from 'multer';
import { getCreatePost, getFiles, postCreatePost, viewPost } from '../controllers/postController.js';
import { checkCreatePost } from '../middleware/checkCreatePost.middleware.js';

const multer_upload = multer()
export const postRouter: Router = express.Router();

postRouter.route('/post/create')
    .get(getCreatePost)
    .post(multer_upload.array('files', 10), checkCreatePost, postCreatePost);

postRouter.route('/post/:id')
    .get(viewPost)

postRouter.get('/post/:id/files', getFiles);