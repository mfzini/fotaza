import express, { Router } from 'express';
import { collectionAddPost, collectionRemovePost, collectionsView, createCollection, deleteCollection, getCollection, renameCollection } from '../controllers/collectionsController.js';
export const collectionsRouter: Router = express.Router();

collectionsRouter.route('/collections')
    .get(collectionsView)
    .patch(renameCollection)
    .post(createCollection)
    .delete(deleteCollection)

collectionsRouter.route('/collections/:id')
    .get(getCollection)
    .post(collectionAddPost)
    .delete(collectionRemovePost);