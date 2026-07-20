import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { Op } from 'sequelize';

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
                        email: {
                            [Op.iLike]: email
                        }
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
        const user = await User.findByPk(id, { include: [Role] });
        if (!user) throw new Error('User not found');
        if (user.strikes > 2) {
            throw new Error("Estas baneado, ameo");
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
})
