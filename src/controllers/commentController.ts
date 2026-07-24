import type { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";
import { normalize } from "../utils/sCleaner.js";
import { File } from "../models/File.js";
import { Post } from "../models/Post.js";

export async function makeComment(req: Request, res: Response, next: NextFunction) {
    const authorId = (req.user as User).id;
    const fileId = req.query.file as string;
    const text = normalize(req.body.text);
    if (!text) return next(new Error('Los comentarios no pueden estar vacios.'));
    const file = await File.findByPk(fileId, {
        include: [Post]
    });
    if (!file) return res.status(404).end();
    if (!file.post.canBeCommented) return res.redirect(`${req.url}`);
    const comment = await Comment.create({ authorId, fileId, text });
    res.redirect(`${req.url}?file=${fileId}&#${comment.id}`);
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const commentId = req.params.commentId as string;
    const userId = user.id;
    const comment = await Comment.findByPk(commentId, {
        include: [{
            model: File, include: [Post]
        }]
    });
    if (!comment) return res.status(404).end();
    const isAllowed = comment.authorId == userId
        || user.id == comment.file.post.authorId
        || user.isMod();
    if (!isAllowed) return res.status(403).end();

    await comment.destroy();
    res.status(200).end();
}
