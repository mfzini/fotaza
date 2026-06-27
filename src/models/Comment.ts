import { AfterCreate, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User.js";
import { Post } from "./Post.js";
import { File } from "./File.js";
import { Notification } from "./Notification.js";

@Table
export class Comment extends Model<Comment, {}> {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column(DataType.STRING)
    declare text: string;

    @BelongsTo(() => User)
    declare author: User;
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare authorId: string;

    @BelongsTo(() => File)
    declare file: File;
    @ForeignKey(() => File)
    @Column(DataType.UUID)
    declare fileId: string;

    @AfterCreate
    static async notify(c: Comment) {
        const f = await c.$get('file');
        const p = await f?.$get('post');
        const a = await c.$get('author');
        if (c.authorId == p?.authorId) return;
        await Notification.create({
            message: `${a?.username} ha comentado un archivo en tu publicacion.`,
            href: `/post/${p?.id}`,
            target: p?.authorId
        })
    }


}