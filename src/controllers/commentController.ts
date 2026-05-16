import type { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";

export async function makeComment(req: Request, res: Response, next: NextFunction) {
    const authorId = (req.user as User).id;
    const fileId = req.params.fileId as string;
    const { text } = req.body;
    const comment = await Comment.create({ authorId, fileId, text });
    res.json(comment.toJSON());
}
