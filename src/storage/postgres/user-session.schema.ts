import {  Optional } from "sequelize";
import { Column, DataType, Table, Model} from "sequelize-typescript";


export type UserSessionAttributes = {
    id?: string;
    sessionId: string;
    userId: string;
    deviceInfo?: string;
    city?: string;
    country?: string;
    lastLoggedIn?: Date;
    
}

export type CreateUserSessionAttributes = Optional<UserSessionAttributes, 'id'>

@Table({
    modelName: 'userSession'
})
export class UserSession extends Model<UserSessionAttributes, CreateUserSessionAttributes>{
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey:true
    })
    id?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    userId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    sessionId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    deviceInfo?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null,
    })
    city?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null,

    })
    country?: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: null,
    })
    lastLoggedIn?: Date;

}