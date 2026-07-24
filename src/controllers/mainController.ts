import type { NextFunction, Request, Response } from "express";
import { Follow, User } from "../models/User.js";
import { Post, Tag } from "../models/Post.js";
import { File } from '../models/File.js'
import { col, fn, literal, where } from "sequelize";
import { Rating } from "../models/Rating.js";

export async function getHome(req: Request, res: Response) {

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { count, rows: recientes } = await Post.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
        include: [User, Tag, File],
        distinct: true
    });

    const totalPages = Math.ceil(count / limit);

    const ratingCountSubquery = literal(`(
    SELECT COUNT("Ratings"."userId")
    FROM "Files" AS "f"
    INNER JOIN "Ratings" ON "Ratings"."fileId" = "f"."id"
    WHERE "f"."postId" = "Post"."id")`);

    const top = await Post.findAll({
        attributes: {
            include: [
                [ratingCountSubquery, 'ratingCount']
            ]
        },
        where: where(ratingCountSubquery, '>', 0),
        include: [
            User,
            Tag,
            {
                model: File,
                include: [Rating]
            }
        ],
        order: [[literal('"ratingCount"'), 'DESC']],
        limit: 5
    });
    res.render('index', { recientes, top, page, totalPages, limit })
}

export async function catchAll(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    res.render('error', { err });
}