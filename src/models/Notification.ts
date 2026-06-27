import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User.js";

@Table
export class Notification extends Model {
    @PrimaryKey
    @Column(DataType.UUID)
    declare id: string;
    
    @ForeignKey(() => User)
    declare userId: string
    @BelongsTo(() => User)
    declare user: string;

    @Column(DataType.STRING)
    declare message: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare seen: boolean;

    @Column(DataType.STRING)
    declare href: string;
}