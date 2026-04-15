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
            primaryKey: true,
            defaultValue: sequelize.literal('gen_random_uuid()')
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
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