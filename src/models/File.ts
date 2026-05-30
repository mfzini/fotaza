import {
    Table,
    Model,
    Column,
    PrimaryKey,
    DataType,
    Default,
    HasMany,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import { Post } from "./Post.js";
import { Comment } from "./Comment.js";
import { Rating } from "./Rating.js";

@Table({ paranoid: true, })
export class File extends Model {
    
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

    @Column(DataType.STRING)
    declare watermark: string;

    @HasMany(() => Rating)
    declare ratings: Rating[];

    @HasMany(() => Comment)
    declare comments: Comment[];

    @ForeignKey(() => Post)
    declare postId: string;
    @BelongsTo(() => Post)
    declare post: Post;
}

