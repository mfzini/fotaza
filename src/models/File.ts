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
    AutoIncrement,
    Unique,
    HasOne,
    AfterCreate,
} from "sequelize-typescript";
import { Post } from "./Post.js";
import { Comment } from "./Comment.js";
import { Rating } from "./Rating.js";
import { User } from "./User.js";

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

    @HasMany(() => Report)
    declare reports: Report[];

    @ForeignKey(() => Post)
    declare postId: string;
    @BelongsTo(() => Post)
    declare post: Post;
}

@Table
export class Report extends Model {

    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare userId: string;

    @PrimaryKey
    @ForeignKey(() => File)
    @Column(DataType.UUID)
    declare fileId: string;

    @Column(DataType.TEXT)
    declare desc: string;

    @ForeignKey(() => ReportReason)
    declare reasonId: number;

    @BelongsTo(() => User)
    declare user: User;


    @BelongsTo(() => File)
    declare file: File;

    @BelongsTo(() => ReportReason)
    declare reason: ReportReason;

}

@Table
export class ReportReason extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING)
    declare reason: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare moderated: boolean;
}
