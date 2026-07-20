import { Op } from "sequelize";
import { AfterCreate, AfterUpdate, AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Post } from "./Post.js";
import { File } from "./File.js";
import { User } from "./User.js";
import { Comment } from "./Comment.js";

@Table
export class ReportReason extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Unique
    @Column(DataType.STRING)
    declare reason: string;

}

@Table
export class ReportFile extends Model {

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

    @Default(true)
    @Column(DataType.BOOLEAN)
    declare isActive: boolean;

    @ForeignKey(() => ReportReason)
    @Column(DataType.INTEGER)
    declare reasonId: number;

    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => File)
    declare file: File;

    @BelongsTo(() => ReportReason)
    declare reason: ReportReason;

    @AfterCreate
    static async flagPost(r: ReportFile) {
        const f = await r.$get('file', { include: [Post] });
        const p = f?.post;
        if (p) {
            p.isModifiable = false;
            await p.save();
        }
    };

    @AfterUpdate
    static async reFlagPost(r: ReportFile) {
        const post = await r.$get('file', { include: [{ model: Post, include: [File] }] })
            .then(f => f?.post)
        if (!post) return
        const fileIds = post.files.map(f => f.id);
        const shouldBeModifiable = await ReportFile.count({
            where: {
                fileId: { [Op.in]: fileIds },
                isActive: true
            }
        }).then(c => c == 0);

        if (shouldBeModifiable) {
            post.isModifiable = true;
            await post.save();
        }
    }
}

@Table
export class ReportComment extends Model {

    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare userId: string;

    @PrimaryKey
    @ForeignKey(() => Comment)
    @Column(DataType.UUID)
    declare commentId: string;

    @Column(DataType.TEXT)
    declare desc: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    declare isActive: boolean;

    @ForeignKey(() => ReportReason)
    @Column(DataType.INTEGER)
    declare reasonId: number;

    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => Comment)
    declare comment: Comment;

    @BelongsTo(() => ReportReason)
    declare reason: ReportReason;
}