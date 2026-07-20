import { BelongsToMany, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User.js";

@Table
export class Role extends Model {

    @PrimaryKey
    @Default("user")
    @Column(DataType.STRING)
    declare name: string;

    @BelongsToMany(() => User, () => UserRole)
    declare users: User[];
}

@Table
export class UserRole extends Model {
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare userId: string;

    @ForeignKey(() => Role)
    @Column(DataType.STRING)
    declare role: string;

}