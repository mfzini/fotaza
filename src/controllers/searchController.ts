import type { Request, Response, NextFunction } from "express"
import { User } from "../models/User.js";
import { Post, PostTags, Tag } from "../models/Post.js";
import { Op } from "sequelize";

export async function search(req: Request, res: Response, next: NextFunction) {
    const { option } = req.body;
    let q = req.body.q;
    if (!q) {
        return res.redirect('/');
    };
    let resultados;
    switch (option) {
        case 'tags':
            q = q.split(',').map((q:string) => q.trim())
            resultados = await Post.findAll({
                include: [Tag],
                where: {
                    '$tags.tag$': {
                        [Op.in]: q
                    }
                }
            })
            break;
        case 'username':
            resultados = await User.findAll({
                where: {
                    username: {
                        [Op.like]: `%${q}%`
                    }
                },
                attributes: ['id', 'username']
            });
            break;
        case 'title':
            resultados = await Post.findAll({
                where: {
                    title: {
                        [Op.like]: `%${q}%`
                    }
                },
                include: [Tag]
            })
            break;
    }
    res.render('search', {resultados, option});
}