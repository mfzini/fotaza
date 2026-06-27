import type { Request, Response, NextFunction } from 'express'
import { File } from '../models/File.js'
import { User } from '../models/User.js'
import { Report } from '../models/File.js'
import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';

export async function reportFile(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as User).id;

    const { fileId, reasonId, desc } = req.body;
    if (!reasonId || !fileId) return res.status(400).end();

    const file = await File.findByPk(fileId, {include: [Post]});
    if (!file) return res.status(404).end();
    if (file.post.authorId == userId) return res.status(400).end();

    const exists = await Report.findOne({
        where: {
            fileId, userId
        }
    });
    if (exists) return res.status(409).end();

    try {
        const report = await Report.create({ userId, fileId, reasonId, desc });
        res.status(201).json({ id: report.id, reason: reasonId });
        next();
    } catch (e) {
        return res.status(500).json({ message: 'Algo malió sal creando el reporte.' });
        console.error(e);
    }
}

export async function reportComment(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as User).id;
    const { commentId, reasonId, desc } = req.body;

    if (!commentId || !reasonId) return res.status(400).end();

    const comment = await Comment.findByPk(commentId, {
        include: [{
            model: File,
            include: [Post]
        }]
    });
    if (!comment) return res.status(404).end();
    if (comment.authorId == userId || comment.authorId == comment.file.post.authorId) return res.status(400).end();

    const exists = await Report.findOne({
        where: {
            userId, commentId
        }
    });
    if (exists) return res.status(409).end();

    try {
        const report = await Report.create({ userId, commentId, reasonId, desc });
        res.status(201).json({ id: report.id, reason: reasonId });
        next();
    } catch (e) {
        return res.status(500).json({ message: 'Algo malió sal creando el reporte.' });
        console.error(e);
    }
}