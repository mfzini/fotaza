import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { File } from "../models/File.js";
import { Rating } from "../models/Rating.js";
import { Post } from "../models/Post.js";
import { NoNotification } from "../utils/customErrors.js";

export async function getRatings(req: Request, res: Response, next: NextFunction) {
    const { fileId } = req.params;
    if (!fileId) return res.status(400).end();
    const ratings = await Rating.findAll({ where: { fileId } })
    return res.status(200).json(ratings);
}

export async function postRating(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    if (!user) res.status(403).end();
    const fileId = req.params.fileId as string;
    const value = req.body.rating;
    if (!fileId || !value || value < 0 || value > 5) return res.status(400).end();
    const file = await File.findByPk(fileId, { include: [{ model: Post, attributes: ['authorId'] }] });
    if (!file) return res.status(404).json(new Error("No pudimos encotrar el archivo."));
    if (file.post.authorId == user.id) return res.status(403).end();

    let rating = await Rating.findOne({ where: { userId: user.id, fileId } });

    if (!rating) {
        try {
            rating = await Rating.create({ fileId, value, userId: user.id });
        } catch (e) {
            if (!(e instanceof NoNotification))
                console.error(e);
        }
    }
    else if (rating.value == value) {
        await rating.destroy();
    } else {
        rating.value = value;
        await rating.save();
    }
    res.redirect(`/post/${file.postId}?file=${file.id}`);
}


