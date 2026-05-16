import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User.js";
import { Post } from "./Post.js";
import { File } from "./File.js";

@Table
export class Comment extends Model<Comment, {}> {
    
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
    declare file: Post;
    @ForeignKey(()=> File)
    @Column(DataType.UUID)
    declare fileId: string;

    

}