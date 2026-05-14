import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { File } from "../models/File.js";
import { Rating } from "../models/Rating.js";

export async function getRatings(req: Request, res: Response, next: NextFunction) {
    const postId = req.query.post as string;
    const userId = req.query.user as string;
    if (!userId && !postId || userId && postId)
        return res.status(400).json(new Error("Solo se puede buscar por usuario o por publicación."));
    if (userId) {
        const user = await User.findByPk(userId);
        const valoraciones = await user?.$get('ratings');
        res.status(200).json(valoraciones);
    }

    const ratings = await Rating.findAll({where: {
        postId
    }})

    return res.status(200).json(ratings);

}

export async function rate(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as User).id;
    const fileId = req.body.fileId;
    const value = req.body.value as number;
    const exists = await Rating.findOne({ where: { userId, fileId } });
    if (exists) {
        exists.$set('value', value);
        return res.json({ msg: 'Updated.', exists });
    }
    const file = await File.findByPk(fileId);
    if (!file) return res.json(new Error("No pudimos encotrar el archivo."));

    const rating = await file?.$create('rating', { userId, value });
    res.json(rating);
}


