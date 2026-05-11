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
} from "sequelize-typescript";
import { User, type PublicUser } from "./User.js";
import type { UUID } from "node:crypto";
import { File } from "./File.js";
import { Op } from "sequelize";

export interface PostDTO {
    id: string;
    author: PublicUser;
    title: string;
    desc: string;
    tags: string[];
    files: {
        url: string;
        mimetype: string;
    }[];
    location: string;
}

@Table({ paranoid: true })
export class Post extends Model<Post, {
    authorId: UUID;
    title: string;
    desc: string;
}> {
    public async getDTO(): Promise<PostDTO> {
        const author = (await this.$get('author'))?.toDTO();
        const tags = (await this.$get('tags'))?.map(t => t.tag);
        const files = (await this.$get('files'))?.map((f) => {
            const { url, mimetype } = f;
            return { url, mimetype }
        });
        return {
            id: this.id,
            author: author,
            title: this.title,
            desc: this.desc,
            tags,
            files,
        } as PostDTO;
    }
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Validate({ notEmpty: true, notNull: true })
    @Column(DataType.STRING)
    declare title: string;

    @Column(DataType.STRING)
    declare desc: string;

    @ForeignKey(() => User)
    declare authorId: string;

    @BelongsTo(() => User)
    declare author: User;

    @BelongsToMany(() => File, () => PostFiles)
    declare files: File[];

    @ForeignKey(() => Tag)
    declare tagId: string;

    @BelongsToMany(() => Tag, () => PostTags)
    declare tags: Tag[];

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

    @BelongsToMany(() => Post, () => PostTags)
    declare post: Post[];
}

@Table
export class PostTags extends Model {
    @ForeignKey(() => Post)
    @Column(DataType.UUID)
    declare postId: string;

    @ForeignKey(() => Tag)
    @Column(DataType.STRING)
    declare tag: string;
}