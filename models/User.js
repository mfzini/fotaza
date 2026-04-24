import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import bcrypt from 'bcrypt';


export class User extends Model {
    comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            unique: { msg: "Ya existe un usuario con ese nombre." },
            allowNull: { msg: "El username no puede estar vacio." },
            validate: {
                is: {
                    args: /^[a-zA-Z0-9_]{3,16}$/,
                    msg: "En el username solo se permiten caracteres alfanuméricos y guiones bajos."
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 30],
                    msg: "La contraseña debe tener como mínimo seis caracteres."
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: { msg: "Ese email ya está en uso." },
            validate: {
                isEmail: {
                    msg: "Formato de email inválido."
                }
            }
        }
    },
    {
        hooks: {
            beforeSave: async (user) => {
                if (!user.changed('password'))
                    return;
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        sequelize
    },
);
User.sync({ force: true })