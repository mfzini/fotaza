import type { NextFunction, Request, Response } from "express";
import { Follow, User } from "../models/User.js";
import { Post, Tag } from "../models/Post.js";
import { Rating } from "../models/Rating.js";
import { col, fn } from "sequelize";
import { File } from "../models/File.js";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const profileId = (req.params.id ?? user.id) as string;
    const profile = await User.findByPk(profileId);
    if (!profile) {
        return next(new Error('Estamos teniendo dificultades para encontrar ese usuario.'));
    }
    const recientes = await Post.findAll({
        where: {
            authorId: profileId
        },
        limit: 20,
        order: [['createdAt', 'DESC']],
        include: [Tag, File]
    });

    const top = await Post.findAll({
        where: {
            authorId: profileId
        },
        subQuery: false,
        include: [Tag, {
            model: File,
            attributes: [],
            required: true,
            include: [{
                model: Rating,
                attributes: [],
                required: true
            }]
        }],
        group: ['Post.id', 'tags.tag',
            'tags->PostTags.postId', 'tags->PostTags.tag'],
        order: [[fn('COUNT', col('files.ratings.userId')), 'DESC']],
        limit: 5
    });
    let isOwn: boolean = false;
    let isFollowing;
    if (user) {
        isOwn = user.id == profileId;
        isFollowing = await Follow.findOne({
            where: {
                user: user.id, target: profileId
            }
        });

    }
    res.render('profile', { profile: profile?.toJSON(), isFollowing, isOwn, recientes, votados: top });

}

export async function follow(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const targetId = req.params.id as string;
    if (user.id == targetId) {
        return res.status(400).json({ message: 'No te podés seguir a vos mismo, ameo!' })
    }
    const target = await User.findByPk(targetId);
    if (!target) {
        return res.status(404).json({ message: 'Usuario no encontrado.' })
    }
    let f = await Follow.findOne({ where: { user: user.id, target: targetId } });
    if (f) {
        f.destroy();
        return res.status(204).end();
    }
    f = await Follow.create({
        user: user.id, target: targetId
    });
    res.status(200).end();
}
