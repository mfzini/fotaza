import {
    Table,
    Model,
    Column,
    PrimaryKey,
    IsUUID,
    Default,
    DataType,
    Unique,
    AllowNull,
    Validate,
    BeforeSave
} from "sequelize-typescript";
import bcrypt from 'bcrypt';

export interface PublicUser {
    id: string;
    username: string;
    email: string;
}

@Table({ paranoid: true })
export class User extends Model<User, {
    username: string;
    email: string;
    password: string;
}> {


    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;


    @Unique({ name: "username", msg: "Username no disponible" })
    @AllowNull(false)
    @Validate({
        is: {
            args: /^[a-zA-Z0-9_]{3,16}$/,
            msg: "En el username solo se permiten caracteres alfanuméricos y guiones bajos."
        }
    })
    @Column(DataType.STRING)
    declare username: string;


    @AllowNull(false)
    @Validate({
        len: {
            args: [6, 70],
            msg: "La contraseña debe tener como mínimo seis caracteres."
        }
    })
    @Column(DataType.STRING)
    declare password: string;

    @Unique({ name: "email", msg: "Email incorrecto." })
    @Validate({
        isEmail: {
            msg: "Formato de email inválido."
        }
    })
    @Column(DataType.STRING)
    declare email: string;

    @BeforeSave
    static async hashPassword(user: User) {
        if (!user.changed('password')) return;
        user.password = await bcrypt.hash(user.password, 10);
    }

    async comparePassword(password: string) {
        return bcrypt.compare(password, this.password);
    }

    toDTO() : PublicUser {
        return {
            id: this.id,
            username: this.username,
            email: this.email
        }

    }
}