import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { Post, Tag } from "../models/Post.js";

export async function getHome(req: Request, res: Response) {
    const posts = await Post.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
            { model: User, as: 'author' },
            { model: Tag }                 
        ]
    });
    res.render('index', posts)
}

export async function catchAll(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    res.send(err.message);
}