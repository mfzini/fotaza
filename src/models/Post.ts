import {
    Table,
    Model,
    Column,
    PrimaryKey,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    BelongsToMany,
    AllowNull,
    Validate,
    HasMany,
    AfterCreate,
} from "sequelize-typescript";
import { Follow, User } from "./User.js";
import type { UUID } from "node:crypto";
import { File } from "./File.js";
import { Op } from "sequelize";
import { Comment } from "./Comment.js";
import { Rating } from "./Rating.js";
import { Notification } from "./Notification.js";

@Table({paranoid: true})
export class Post extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: UUID;

    @AllowNull(false)
    @Validate({ notEmpty: true, notNull: true })
    @Column(DataType.STRING)
    declare title: string;

    @Column(DataType.STRING)
    declare desc: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    declare isModifiable: boolean;

    @Default(true)
    @Column(DataType.BOOLEAN)
    declare canBeCommented: boolean;

    @HasMany(() => File, { onDelete: 'CASCADE' })
    declare files: File[];

    @BelongsToMany(() => Tag, () => PostTags)
    declare tags: Tag[];

    @ForeignKey(() => User)
    declare authorId: UUID;

    @BelongsTo(() => User)
    declare author: User;

    public static async findByUsername(username: string): Promise<Post[]> {
        return Post.findAll({
            include: [{
                model: User,
                where: { username }
            }]
        });
    }

    public static async findByTags(tags: string[]): Promise<Post[]> {
        return Post.findAll({
            include: [{ model: Tag }],
            where: { '$tags.tag$': { [Op.in]: tags } }
        });
    }

    @AfterCreate
    static async notify(p: Post) {
        const u = await p.$get('author');
        const list = await Follow.findAll({ where: { targetId: p.authorId } });
        console.log(list)
        const promises : Promise<Notification>[] = [];
        list.forEach(f => {
            promises.push(Notification.create({
                userId: f.userId,
                message: `${u?.username} ha creado una nueva publicación ${p.title}.`,
                href: `/post/${p.id}`
            }))
        });
        await Promise.all(promises);
    }
}

@Table
export class Tag extends Model<Tag, { tag: string }> {
    @PrimaryKey
    @Column(DataType.STRING)
    declare tag: string;

    @BelongsToMany(() => Post, () => PostTags)
    declare posts: Post[];
}

@Table
export class PostTags extends Model {
    @ForeignKey(() => Post)
    @Column(DataType.UUID)
    declare postId: UUID;

    @ForeignKey(() => Tag)
    @Column(DataType.STRING)
    declare tag: string;
}

