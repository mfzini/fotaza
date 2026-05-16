import {
    Table,
    Model,
    Column,
    PrimaryKey,
    Default,
    DataType,
    Unique,
    AllowNull,
    Validate,
    BeforeSave,
    HasMany,
} from "sequelize-typescript";
import bcrypt from 'bcrypt';
import { Post } from "./Post.js";
import { Comment } from "./Comment.js";
import { Rating } from "./Rating.js";

@Table({ paranoid: true })
export class User extends Model<User, { username: string; email: string; password: string; }> {

    @PrimaryKey
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

    @HasMany(() => Post)
    declare posts: Post[]

    @HasMany(() => Comment)
    declare comments: Comment[];

    @HasMany(() => Rating)
    declare ratings: Rating[];

    @BeforeSave
    static async hashPassword(user: User) {
        if (!user.changed('password')) return;
        user.password = await bcrypt.hash(user.password, 10);
    }

    async comparePassword(password: string) {
        return bcrypt.compare(password, this.password);
    }
}