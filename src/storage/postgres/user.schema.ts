import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { Column, DataType, Table } from "sequelize-typescript";

export enum UserType {
    student = 'student',
    mentor = 'mentor'
}

@Table
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey:true
    })
    declare id: CreationOptional<string>;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare firstName: string;


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare lastName: string;


    @Column({
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    })
    declare email: string;


    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    declare password: string


    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    declare phone: string


    @Column({
        type: DataType.STRING,
        defaultValue: UserType.student,
        allowNull: false
    })
    declare userType: UserType


    @Column({
        allowNull: false,
        type: DataType.BOOLEAN
    })
    declare isConfirmed: boolean
   
}