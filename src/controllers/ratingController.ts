import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { File } from "../models/File.js";
import { Rating } from "../models/Rating.js";

export async function getRatings(req: Request, res: Response, next: NextFunction) {
    const fileId = req.params.fileId;
    const ratings = await Rating.findAll({where: {fileId}})
    return res.status(200).json(ratings);
}

export async function postRating(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as User).id;
    const user = req.user as User;
    const { fileId, value } = req.body;
    const file = await File.findByPk(fileId);
    if (!file) return res.json(new Error("No pudimos encotrar el archivo."));

    let rating = await Rating.findOne({ where: { userId, fileId } });
    if (!rating) {
        rating = await Rating.create({ fileId, value, userId });
        return res.status(201).json(rating);
    }
    if (rating.value == value) {
        await rating.destroy();
        return res.status(204).end();
    }
    rating.value = value;
    await rating.save();
    res.status(202).end();
}


