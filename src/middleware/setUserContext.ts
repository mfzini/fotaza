import type { NextFunction, Request, Response } from "express";
import type { User } from "../models/User.js";

export async function setUserContext(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        const user: User = req.user as User;
        res.locals.user = user.toDTO();
    }
    next();
}