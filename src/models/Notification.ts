import { AllowNull, BeforeCreate, BelongsTo, Column, DataType, Default, ForeignKey, Model, NotNull, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User.js";

@Table
export class Notification extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
    
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
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

    @BeforeCreate
    static async check(notification: Notification) {
        if (await Notification.count({where: {
            userId: notification.userId,
            href: notification.href
        }})) throw new Error("No notification");
    }
}