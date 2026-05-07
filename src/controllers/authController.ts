import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js'
import { ValidationError } from 'sequelize';
import passport from 'passport';

export async function getSignUp(req: Request, res: Response) {
    res.render('signup');
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

export async function getLogin(req: Request, res: Response) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('login');
}

export async function postLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.render('login', {
            err: 'Los campos no pueden estar vacios.',
            email
        });
    }
    passport.authenticate('local', (err: Error, user: User, info: any) => {
        if (err) return next(err);
        if (!user) {
            return res.render('login', {
                err: info?.message || 'Error de autenticación',
                email
            }
            );
        }
        req.login(user, (err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    })(req, res, next);
}

export async function postLogout(req: Request, res: Response, next: NextFunction) {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.clearCookie('jwt');
            res.redirect('/login');
        })
    })
}