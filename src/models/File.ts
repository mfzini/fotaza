import {
    Table,
    Model,
    Column,
    PrimaryKey,
    DataType,
    BelongsToMany,
    IsUUID,
    Default
} from "sequelize-typescript";
import { Post, PostFiles } from "./Post.js";

@Table({ paranoid: true,  })
export class File extends Model<File, {
    hash: string;
    url: string;
    mimetype: string;
}> {
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column(DataType.STRING)
    declare url: string;

    @Column(DataType.STRING)
    declare hash: string;

    @Column(DataType.STRING)
    declare mimetype: string;

    @BelongsToMany(() => Post ,() => PostFiles)
    declare posts: Post[];

}