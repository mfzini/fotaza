import type { NextFunction, Request, Response } from "express";
import { Follow, Interest, User } from "../models/User.js";
import { Post, Tag } from "../models/Post.js";
import { Rating } from "../models/Rating.js";
import { col, fn } from "sequelize";
import { File } from "../models/File.js";
import { NoNotification } from "../utils/customErrors.js";

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
                userId: user.id, targetId: profileId
            }
        });

    }
    let followers = await Follow.findAndCountAll({ where: { targetId: profileId }, include: [{ model: User, as: 'user' }] });
    res.render('profile', { profile: profile?.toJSON(), isFollowing, isOwn, recientes, votados: top, followers });

}

export async function follow(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    if (!user) return res.status(403).end();
    const targetId = req.params.id as string;
    if (user.id == targetId) return res.status(400).end();
    const target = await User.findByPk(targetId);
    if (!target) return res.status(404).end();
    let f = await Follow.findOne({ where: { userId: user.id, targetId } });
    if (f) {
        f.destroy();
        return res.redirect(`/profile/${targetId}`);
    }
    try {
        f = await Follow.create({
            userId: user.id, targetId: target.id
        });
    } catch (e: any) {
        if (!(e instanceof NoNotification))
            console.error(e);
    }
    return res.redirect(`/profile/${targetId}`);
}
export async function interested(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as User).id;
    const fileId = req.params.fileId;
    try {
        const interested = await Interest.create({
            userId,
            fileId
        });
        res.status(200).end();
    } catch (e) {
        res.status(500).end();
    }
}
