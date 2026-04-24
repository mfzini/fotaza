import { User } from '../models/User.js'

export async function getSignUp(req, res) {
    res.render('signup');
}

export async function getLogin(req, res) {
    res.render('login');
}

export async function postLogin(req, res) {
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
    } catch (e) {
        res.render('login', { err: e.message, email })
    }

}

export async function postSignUp(req, res) {
    const { username, email, password } = req.body;
    try {

        const user = await User.create({ username, email, password });
        res.redirect('login');
    } catch (e) {
        const err = e.errors[0].message;
        res.render('signup', {
            values: { username, email },
            err
        })
    }

}