import type { NextFunction, Request, Response } from "express";
import type { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import { Mail } from "../models/Mail.js";

export async function setUserContext(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        const user: User = req.user as User;
        const notificationsCount = await Notification.count({where: {
            userId: user.id,
            seen: false
        }});
        const unreadedMailCount = await Mail.count({where: {
            toId: user.id,
            readed: false
        }})
        const roles = await user.$get('roles');
        res.locals.user = user;
        res.locals.notificationsCount = notificationsCount;
        res.locals.unreadedMailCount = unreadedMailCount;
    }
    next();
}