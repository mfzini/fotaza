import type { Request, Response, NextFunction } from 'express'
import { File } from '../models/File.js'
import { User } from '../models/User.js'
import { Comment } from '../models/Comment.js';
import { ReportComment, ReportFile } from '../models/Reports.js';
import { Post } from '../models/Post.js';

export async function report(req: Request, res: Response, next: NextFunction) {
    const { fileId, commentId } = req.body;
    if (commentId) return reportAComment(req, res, next);
    else if (fileId) return reportAFile(req, res, next);
    else return res.status(400).end();
}

async function reportAFile(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as User).id;
    const { postId, fileId, reason, desc } = req.body;
    if (!reason) return res.status(400).end();

    const file = await File.findByPk(fileId, {include: [Post]});
    if (!file) return res.status(404).end();

    if (file.post.authorId == userId) return res.status(403).end();

    const cantBeReported = await ReportFile.findOne({ where: { fileId, userId } });
    if (cantBeReported) return res.status(409).end();

    try {
        await ReportFile.create({ userId, fileId, reasonId: reason, desc });
    } catch (e) {
        console.error(e);
        return res.status(500).end();
    }
    res.redirect(`/post/${postId}?file=${fileId}`);
}

async function reportAComment(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as User).id;
    const { postId, fileId, commentId, reason, desc } = req.body;
    if (!reason) return res.status(400).end();

    const comment = await Comment.findByPk(commentId, {
        include:
        {
            model: File, attributes: ['id'],
            include: [{
                model: Post,
                attributes: ['id', 'authorId']
            }]
        }
    });
    if (!comment) return res.status(404).end();
    if (comment.authorId == userId || comment.authorId == comment.file.post.authorId)
        return res.status(400).end();
    const cantBeReported = await ReportComment.findOne({ where: { commentId, userId } });
    if (cantBeReported) return res.status(409).end();
    try {
        await ReportComment.create({ userId, commentId, reasonId: reason, desc });
    } catch (e) {
        console.error(e);
        return res.status(500).end();
    }
    res.redirect(`/post/${postId}?file=${fileId}`);
}

export async function dismissCommentReport(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const commentId = req.params.commentId as string;
    const comment = await Comment.findByPk(commentId, {
        include: [{
            model: File,
            include: [Post]
        }, {
            model: ReportComment,
            where: {
                commentId,
                isActive: true
            }
        }]
    });
    if (!comment) return res.status(404).end();
    const isAllowed = user.isMod() || user.id == comment.file.post.authorId;
    if (!isAllowed) return res.status(403).end();

    const promises: Promise<ReportComment>[] = [];

    comment.reports.forEach(report => {
        report.isActive = false;
        promises.push(report.save());
    });
    await Promise.all(promises);
    res.status(200).end();
}

export async function dismissFileReport(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const fileId = req.params.fileId as string;
    const file = await File.findByPk(fileId, {
        include: [{
            model: ReportFile,
            where: { isActive: true }
        }]
    });
    if (!file) return res.status(404).end();
    if (!user.isMod()) return res.status(403).end();
    const promises: Promise<ReportFile>[] = [];
    file.reports.forEach(report => {
        report.isActive = false;
        promises.push(report.save());
    })
    await Promise.all(promises);
    res.status(200).end();
}


export async function handleFileReport(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    if (!user.isMod()) return res.status(403).end();
    const fileId = req.params.fileId as string;

    const file = await File.findByPk(fileId, { include: [{ model: Post, include: [User] }] });
    if (!file) return res.status(404).end();
    const { author } = file.post;
    author.strikes++;
    await author.save();

    const promises: Promise<ReportFile>[] = [];
    const reports = await ReportFile.findAll({
        where: {
            fileId,
            isActive: true
        }
    });
    reports.forEach(report => {
        report.isActive = false;
        promises.push(report.save());
    });

    await Promise.all(promises);
    await file.post.destroy();
    res.status(200).end();
}
