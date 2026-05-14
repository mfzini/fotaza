import {
    Table,
    Model,
    Column,
    PrimaryKey,
    DataType,
    BelongsToMany,
    Default,
    HasMany,
    ForeignKey,
} from "sequelize-typescript";
import { Post, PostFiles } from "./Post.js";
import { Comment } from "./Comment.js";
import { Rating } from "./Rating.js";

@Table({ paranoid: true, })
export class File extends Model<File, {
    hash: string;
    url: string;
    mimetype: string;
}> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column(DataType.STRING)
    declare hash: string;

    @Column(DataType.STRING)
    declare url: string;

    @Column(DataType.STRING)
    declare mimetype: string;

    @HasMany(() => Rating)
    declare ratings: Rating[];

    @HasMany(() => Comment)
    declare comments: Comment[];

    @BelongsToMany(() => Post, () => PostFiles)
    declare posts: Post[];

}

