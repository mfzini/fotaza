import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    let userId = req.params.id as string;
    if (!userId) {
        userId = (req.user as User).id;
    }
    const user = await User.findByPk(userId, {include: [Post]});
    if (!user) next(new Error('Estamos teniendo dificultades para encontrar ese usuario.'));
    res.render('profile', {profile: user?.toJSON()});
}