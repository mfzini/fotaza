import type { Request, Response, NextFunction } from "express"
import { User } from "../models/User.js";
import { Post, Tag } from "../models/Post.js";
import { Op } from "sequelize";
import { normalizeStr } from "../utils/strUtils.js";

export async function search(req: Request, res: Response, next: NextFunction) {
    const { option } = req.body;
    const q = normalizeStr(req.body.q);
    if (!q) {
        return res.redirect('/');
    };
    let resultados;
    switch (option) {
        case 'tags':
            resultados = await Post.findAll({
                include: [{
                    model: Tag,
                    where: {
                        tag: {
                            [Op.in]: q.split(',')
                        }
                    },
                    through: {
                        attributes: []
                    }
                }]
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