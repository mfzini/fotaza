import type { Request, Response, NextFunction } from "express"
import { User } from "../models/User.js";
import { Post, Tag } from "../models/Post.js";
import { Op } from "sequelize";

export async function search(req: Request, res: Response, next: NextFunction) {
    const { option, q } = req.body;
    if (!q) {
        res.json({ msg: 'vo so o te hace?' })
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