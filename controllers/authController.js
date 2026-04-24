import { User } from '../models/User.js'

export async function getSignUp(req, res) {
    res.render('signup');
}

export async function getLogin(req, res) {
    res.render('login');
}
export async function postSignUp(req, res) {
    const { username, email, password } = req.body;
    try {
        
        const user = await User.create({ username, email, password });
        res.redirect('login');
    } catch (e) {
        const err = e.errors[0].message;
        res.render('signup', {
            user: { username, email },
            err
        })
    }
    
}