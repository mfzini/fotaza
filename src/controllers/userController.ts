import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const posts = await Post.findByUsername(user.username);
    res.render('profile',{user, posts});
}

export async function getProfileById(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id as string;
    const user = await User.findByPk(userId);
    if (!user) next(new Error('Estamos teniendo dificultades para encontrar ese usuario.'));
    res.render('profile', user?.toJSON());
}