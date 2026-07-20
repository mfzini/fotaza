import { AfterCreate, BeforeDestroy, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User.js";
import { File } from "./File.js";
import { Notification } from "./Notification.js";
import { ReportComment } from "./Reports.js";

@Table({ paranoid: true })
export class Comment extends Model {

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

    @HasMany(() => ReportComment)
    declare reports: ReportComment[];

    @AfterCreate
    static async notify(c: Comment) {
        const f = await c.$get('file');
        const p = await f?.$get('post');
        const a = await c.$get('author');
        if (c.authorId == p?.authorId) return;
        await Notification.create({
            message: `${a?.username} ha comentado un archivo en tu publicacion ${p?.title}.`,
            href: `/post/${p?.id}?file=${f?.id}#${c.id}`,
            userId: p?.authorId
        })
    }

    @BeforeDestroy
    static async removeReports(comment: Comment) {
        const promises: Promise<ReportComment>[] = [];
        const reports = await ReportComment.findAll({
            where: {
                commentId: comment.id,
                isActive: true
            }
        });
        reports.forEach(report => {
            report.isActive = false;
            promises.push(report.save());
        });
        await Promise.all(promises);
    }


}