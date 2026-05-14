import { BelongsTo, Column, DataType, ForeignKey, Max, Min, Model, PrimaryKey, Table } from "sequelize-typescript";
import  { User } from "./User.js";
import { File } from "./File.js";

@Table
export class Rating extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare userId: string;

    @PrimaryKey
    @ForeignKey(() => File)
    @Column(DataType.UUID)
    declare fileId: string;

    @Min(1)
    @Max(5)
    @Column(DataType.INTEGER)
    declare value: number;

    @BelongsTo(() => User)
    declare user: User;
    
    @BelongsTo(() => File)
    declare file: File;

}