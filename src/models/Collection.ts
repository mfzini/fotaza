import { Model, Column, PrimaryKey, DataType, Default, ForeignKey, BelongsTo, Table, BelongsToMany } from "sequelize-typescript";
import { User } from "./User.js";
import { File } from "./File.js";
import { Post } from "./Post.js";

@Table
export class Collection extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column(DataType.STRING)
    declare name: string;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare ownerId: string;

    @BelongsTo(() => User)
    declare owner: User;

    @BelongsToMany(() => Post, () => CollectionPost)
    declare posts: Post[];

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare isFavorite: boolean;
}

@Table
export class CollectionPost extends Model {
    @PrimaryKey
    @ForeignKey(() => Collection)
    @Column(DataType.UUID)
    declare collectionId: string;

    @PrimaryKey
    @ForeignKey(() => Post)
    @Column(DataType.UUID)
    declare postId: string;
}