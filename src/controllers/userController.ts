import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    const userId = (req.params.id ?? (req.user as User)?.id) as string;
    if (!userId) {
        return res.redirect('/');
    }
    const user = await User.findByPk(userId, { include: [Post] });
    if (!user) {
        return next(new Error('Estamos teniendo dificultades para encontrar ese usuario.'));
    }
    res.render('profile', { profile: user?.toJSON() });
}