import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/User.js';

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
        async (email, password, done) => {
            const errMsg = { message: 'Credenciales incorrectas.' }
            try {
                const user = await User.findOne({
                    where: {
                        email
                    }
                })
                if (!user) {
                    return done(null, false, errMsg);
                }
                const ok = await user.comparePassword(password);
                if (!ok) {
                    return done(null, false, errMsg)
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
})
