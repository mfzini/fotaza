import type { Request, Response, NextFunction } from 'express';
import type { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

export async function notificationsView(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const unreaded = await Notification.findAll({ where: { userId: user.id, seen: false } });
    const readed = await Notification.findAll({ where: { userId: user.id, seen: true } });
    res.render('notifications', { notifications: [...unreaded, ...readed] });
}

export async function markAsReaded(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const { id } = req.body;
    const notification = await Notification.findByPk(id);
    if (!notification) return res.status(404).end();
    if (user.id != notification.userId) return res.status(403).end();
    notification.seen = true;
    await notification.save();
    res.status(200).end();
}
