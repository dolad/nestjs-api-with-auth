import {  Optional } from "sequelize";
import { Column, DataType, Table, Model} from "sequelize-typescript";


export type BusinessOwnersAttributes = {
    id?: string;
    firstName: string;
    lastName: string;
    title: string;
    gender: string;
    employmentStatus: string;
    annualIncome: number;
    dateOfBirth: Date;
    personalCreditLimit: number;
    country: string;
    city: string;
    residentialAddress: string;
    residentialPostcode: string;
    businessId: string;
}

export type CreateBusinessOwnersAttributes = Optional<BusinessOwnersAttributes, 'id'>

@Table({
    modelName: 'businessOwner'
})
export class BusinessOwners extends Model<BusinessOwnersAttributes, CreateBusinessOwnersAttributes>{
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
    firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    lastName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    gender: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
       
    })
    employmentStatus: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
       
    })
    annualIncome: number;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    dateOfBirth: Date;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
       
    })
    personalCreditLimit: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
       
    })
    country: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
       
    })
    city: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
       
    })
    residentialAddress: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
       
    })
    residentialPostcode: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
       
    })
    businessId: string;

}