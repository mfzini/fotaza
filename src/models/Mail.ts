import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript"
import { User } from "./User.js";

@Table
export class Mail extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare fromId: string;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare toId: string;

    @Column(DataType.STRING)
    declare subject: string;

    @Column(DataType.TEXT)
    declare message: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare readed: boolean;

    @BelongsTo(() => User, {as: 'from', foreignKey: 'fromId'})
    declare from: User;

    @BelongsTo(() => User, {as: 'to', foreignKey: 'toId'})
    declare to: User;

}