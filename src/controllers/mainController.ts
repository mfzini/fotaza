import type { NextFunction, Request, Response } from "express";
import { Follow, User } from "../models/User.js";
import { Post, Tag } from "../models/Post.js";
import { File } from '../models/File.js'
import { col, fn } from "sequelize";
import { Rating } from "../models/Rating.js";
import { notify } from "../utils/sendNotifications.js";

export async function getHome(req: Request, res: Response) {
    const recientes = await Post.findAll({
        limit: 20,
        order: [['createdAt', 'DESC']],
        include: [User, Tag, File]
    });

    const top = await Post.findAll({
        subQuery: false,
        include: [User, Tag, {
            model: File,
            attributes: [],
            required: true,
            include: [{
                model: Rating,
                attributes: [],
                required: true
            }]
        }],
        group: ['Post.id', 'author.id', 'tags.tag',
            'tags->PostTags.postId', 'tags->PostTags.tag'],
        order: [[fn('COUNT', col('files.ratings.userId')), 'DESC']],
        limit: 5
    });

    res.render('index', { recientes, top })
}

export async function catchAll(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    res.send(err.message);
}