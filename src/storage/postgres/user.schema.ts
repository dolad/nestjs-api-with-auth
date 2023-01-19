import {  Optional } from "sequelize";
import { Column, DataType, Table, Model, AfterCreate } from "sequelize-typescript";
import { HashManager } from "../../auth/utils/hash";

export enum UserType {
    BUSINESS = 'business',
    BANK = 'bank',
    ADMIN = 'admin'
}

const scopes = {
    removeSensitivePayload: {
      attributes: { exclude: ['password'] },
    },
  };

export type UserAttributes = {
    id?: string,
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    userType: UserType;
    isConfirmed: boolean;
    hasCompletedKYC: boolean;
    createdAt?: Date
    updatedAt?: Date

}

export type UserCreateAttributes = Optional<UserAttributes, 'id'>

@Table({
    scopes: scopes,
    modelName: 'users'
})
export class User extends Model<UserAttributes, UserCreateAttributes> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey:true
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    firstName: string;


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    lastName: string;


    @Column({
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    })
    email: string;


    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    password: string


    @Column({
        type: DataType.STRING,
        defaultValue: UserType.BUSINESS,
        allowNull: false
    })
    userType: UserType


    @Column({
        allowNull: true,
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    isConfirmed: boolean

    @Column({
        allowNull: true,
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    hasCompletedKYC: boolean;

    updatedAt: Date;
    createdAt: Date;

    async isPasswordCorrect(password: string): Promise<boolean> {
        return await new HashManager().bCompare(this.password, password);
      }
    
    @AfterCreate
    static async hashPassword(user: User): Promise<void> {
        const hashPassword = await new HashManager().bHash(user.password);
        user.password = hashPassword;
        await user.save();
    }
   
}