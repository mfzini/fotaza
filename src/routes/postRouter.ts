import express, { Router } from 'express';
import multer from 'multer';
import { deletePost, getCreatePost, postCreatePost, toggleComments, viewPost } from '../controllers/postController.js';
import { checkCreatePost } from '../middleware/checkCreatePost.middleware.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { makeComment } from '../controllers/commentController.js';

const multer_upload = multer()
export const postRouter: Router = express.Router();

postRouter.route('/post/create')
    .get(isAuthenticated, getCreatePost)
    .post(isAuthenticated, multer_upload.array('files', 10), checkCreatePost, postCreatePost);

postRouter.route('/post/:id')
    .get(viewPost)
    .post(isAuthenticated, makeComment)
    .patch(isAuthenticated, toggleComments)
    .delete(isAuthenticated, deletePost);
