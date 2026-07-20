import express from 'express';
import { dismissCommentReport, dismissFileReport, handleFileReport, report } from '../controllers/reportController.js';

export const reportsRouter = express.Router();

reportsRouter.post('/report', report);
reportsRouter.patch('/report/comment/:commentId', dismissCommentReport);
reportsRouter.route('/report/file/:fileId')
    .put(handleFileReport)
    .patch(dismissFileReport);