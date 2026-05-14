import {
    Table,
    Model,
    Column,
    PrimaryKey,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    IsUUID,
    BelongsToMany,
    AllowNull,
    Validate,
    HasMany,
} from "sequelize-typescript";
import { User } from "./User.js";
import type { UUID } from "node:crypto";
import { File } from "./File.js";
import { Op } from "sequelize";
import { Comment } from "./Comment.js";

@Table({ paranoid: true })
export class Post extends Model<Post, { authorId: UUID; title: string; desc: string; }> {
    public static async fetchAllByPk(pk: string) {
        return Post.findByPk(pk, {
            include: [User, Tag, {
                model: File,
                include: [{
                    model: Comment,
                    include: [User]
                }]
            }]
        });
    }

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Validate({ notEmpty: true, notNull: true })
    @Column(DataType.STRING)
    declare title: string;

    @Column(DataType.STRING)
    declare desc: string;

    @BelongsToMany(() => Tag, () => PostTags)
    declare tags: Tag[];

    @ForeignKey(() => User)
    declare authorId: UUID;

    @BelongsTo(() => User)
    declare author: User;

    @BelongsToMany(() => File, () => PostFiles)
    declare files: File[];

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
}

@Table
export class PostFiles extends Model {
    @ForeignKey(() => Post)
    @Column(DataType.UUID)
    declare postId: string

    @ForeignKey(() => File)
    @Column(DataType.UUID)
    declare fileId: string;
}

@Table
export class Tag extends Model<Tag, { tag: string }> {
    @PrimaryKey
    @Column(DataType.STRING)
    declare tag: string;

    @ForeignKey(() => Post)
    declare postId: UUID;

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

