import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    const user = (req.user as User).toDTO();
    const ls = (await Post.findByUsername(user.username));
    const posts = await Promise.all(ls.map(async p => {
        const dto = await p.getDTO();
        return dto;
    }))
    res.render('profile',{user, posts});
}

export async function getProfileById(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id as string;
    let user;
    try {
        user = await User.findByPk(userId).then(u => u?.toDTO());
        if (!user) throw new Error();
    } catch (e) {
        return next(new Error('No pudimos encontrar el usuario. Probá mas tarde.'));
    }
    res.send(user)
}