import type { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";
import { normalize } from "../utils/sCleaner.js";

export async function makeComment(req: Request, res: Response, next: NextFunction) {
    const authorId = (req.user as User).id;
    const fileId = req.params.fileId as string;
    let text = normalize(req.body.text);
    if (!text) return res.status(400).end();
    const comment = await Comment.create({ authorId, fileId, text });
    res.json(comment.toJSON());
}

export async function fetchComments(req: Request, res: Response, next: NextFunction) {
    const fileId = req.params.fileId;
    const comments = await Comment.findAll({where: {fileId},include: {model: User, attributes: ['username']}});
    res.json(comments);
}
