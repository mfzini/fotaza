import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js'
import { ValidationError } from 'sequelize';

export async function getSignUp(req: Request, res: Response) {
    res.render('signup');
}

export async function getLogin(req: Request, res: Response) {
    res.render('login');
}

export async function postLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                email
            }
        });
        const isValid = await user?.comparePassword(password);
        if (!isValid) {
            res.render('login', { err: "Credenciales inválidas.", email })
            return;
        };
        res.redirect('/');
    } catch (err: unknown) {
        next(err);
    }

}

export async function postSignUp(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        res.redirect('login');
    } catch (err: unknown) {
        if (err instanceof ValidationError) {
            res.render('signup', {
                values: { username, email },
                err: err.errors.map(e => e.message)
            })
        } else {
            next(err);
        }
    }
}