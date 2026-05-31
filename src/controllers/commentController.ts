import type { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";

export async function makeComment(req: Request, res: Response, next: NextFunction) {
    const authorId = (req.user as User).id;
    const fileId = req.params.fileId as string;
    let { text } = req.body;
    text = text.trim()                          
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    const comment = await Comment.create({ authorId, fileId, text });
    res.json(comment.toJSON());
}

export async function fetchComments(req: Request, res: Response, next: NextFunction) {
    const fileId = req.params.fileId;
    const comments = await Comment.findAll({where: {fileId},include: {model: User, attributes: ['username']}});
    res.json(comments);
}
