import type { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment.js";
import type { User } from "../models/User.js";

export async function makeComment(req: Request, res: Response, next: NextFunction) {
    const authorId = (req.user as User).id;
    const fileId = req.body.id as string;
    const postId = req.body.postId;
    const text = req.body.comment;
    const comment = await Comment.create({authorId, fileId, text});
    console.log(comment);
    res.redirect(`/post/${postId}`)
}
