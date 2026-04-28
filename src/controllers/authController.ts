import type { Request, Response } from 'express';
import { User } from '../models/User.js'

export async function getSignUp(req: Request, res: Response) {
    res.render('signup');
}

export async function getLogin(req: Request, res: Response) {
    res.render('login');
}

export async function postLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error("Los campos no pueden estar vacios.")
        }
        const user = await User.findOne({
            where: {
                email
            }
        });

        const err = new Error("Credenciales inválidas.");
        if (!user) throw err;
        const isValid = await user.comparePassword(password);
        if (!isValid) throw err;
        res.redirect('/');
    } catch (e: any) {
        res.render('login', { err: e.message, email })
    }

}

export async function postSignUp(req: Request, res: Response) {
    const { username, email, password } = req.body as {
        username: string;
        email: string;
        password: string;
    };
    try {
        const user = await User.create({ username, email, password });
        res.redirect('login');
    } catch (e: any) {
        const err = e;
        console.log(e);
        
        res.render('signup', {
            values: { username, email },
            err
        })
    }

}