import type { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { Mail } from '../models/Mail.js';

export async function mailView(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as User).id;
    let inbox = await Mail.findAll({ where: { toId: userId }, include: ['from'] });

    let outbox = await Mail.findAll({ where: { fromId: userId }, include: ['to'] });
    res.render('mail', { inbox, outbox });
}

export async function sendMail(req: Request, res: Response, next: NextFunction) {
    const fromId = (req.user as User).id;
    let { to, subject, message } = req.body;
    to = await User.findOne({ where: { username: to } });
    if (!to) return res.status(404).end();
    await Mail.create({
        fromId, toId: to.id, subject, message
    });
    res.status(201).end();
}
export async function markAsReaded(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const id = req.params.id as string;
    const mail = await Mail.findByPk(id);
    if (!mail) return res.status(404).end();
    if (mail.toId != user.id) return res.status(403).end();
    mail.readed = true;
    await mail.save();
    res.status(200).end();
}
