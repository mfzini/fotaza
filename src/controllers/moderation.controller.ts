import type { Request, Response, NextFunction } from 'express';
import { ReportComment, ReportFile, ReportReason } from '../models/Reports.js';
import { User } from '../models/User.js';
import { File } from '../models/File.js';
import { col, fn, Op, where } from 'sequelize';
import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';

export async function moderationView(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    let files: File[] = [];
    let comments: Comment[] = [];

    if (user.isMod()) {
        comments = await Comment.findAll({
            include: [User, {
                model: ReportComment,
                include: [User, ReportReason],
                where: { isActive: true },
                required: true
            }]
        });
        const filesIDs = await ReportFile.findAll({
            attributes: ['fileId'],
            where: { isActive: true },
            group: ['fileId'],
            having: where(fn('COUNT', col('fileId')), { [Op.gt]: 2 }),
            raw: true
        }).then(r => r.map(r => r.fileId));

        files = await File.findAll({
            paranoid: false,
            where: { id: { [Op.in]: filesIDs } },
            include: [{
                model: ReportFile,
                include: [ReportReason, User]
            }]
        });
    } else {
        const posts = await Post.findAll({
            where: { authorId: user.id },
            include: [{ model: File, attributes: ['id'] }]
        });

        const fileIds: string[] = [];
        posts.forEach(p => {
            fileIds.push(...p.files.map(f => f.id));
        });
        comments = await Comment.findAll({
            where: {
                fileId: { [Op.in]: fileIds }
            },
            include: [User, {
                model: ReportComment,
                include: [User, ReportReason],
                where: { isActive: true },
                required: true
            }]
        });
    }


    res.render('mod', { files, comments })
}
