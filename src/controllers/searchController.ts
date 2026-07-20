import type { Request, Response, NextFunction } from "express"
import { User } from "../models/User.js";
import { Post, Tag } from "../models/Post.js";
import { Op } from "sequelize";
import { normalize } from "../utils/sCleaner.js";

export async function search(req: Request, res: Response, next: NextFunction) {
    const { tags, username, title } = req.query;
    let q: string | string[] = normalize(req.query.q as string);
    let users: User[] = [];
    if (!q) return res.redirect('/');
    if (username) {
        users = await User.findAll({
            where: {
                username: {
                    [Op.iLike]: `%${q}%`
                }
            },
            attributes: ['id', 'username']
        });
    };

    let posts: Post[] = [];

    const conditions: any[] = [];
    if (title) {
        conditions.push({
            title: { [Op.iLike]: `%${q}%` }
        });
    };

    if (tags) {
        const tagList = q.split(',').map((item: string) => item.trim());

        conditions.push({
            '$tags.tag$': { [Op.in]: tagList }
        });
    };

    if (conditions.length > 0) {
        posts = await Post.findAll({
            where: { [Op.or]: conditions },
            include: [Tag]
        });
    };
    
    res.render('search', { users, posts });
}