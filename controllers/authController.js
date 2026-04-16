import { User } from '../models/User.js'

export async function getSignUp(req, res) {
    res.render('signup');
}

export async function postSignUp(req, res) {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.redirect('login');
}