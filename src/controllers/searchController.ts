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
            resultados = Post.findAll({
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
            resultados = User.findAll({
                where: {
                    username: {
                        [Op.like]: `%${q}%`
                    }
                }
            });
            break;
        case 'title':
            resultados = Post.findAll({
                where: {
                    title: {
                        [Op.like]: `%${q}%`
                    }
                }
            })
            break;
    }

    res.json(await resultados);
}