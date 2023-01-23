import {  Optional } from "sequelize";
import { Column, DataType, Table, Model,  BelongsTo, ForeignKey } from "sequelize-typescript";
import { User } from "./user.schema";

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export enum Title {
    MR = 'mr',
    MRS = 'mrs',
    MISS = 'miss',
    MS = 'ms',
}

export enum EmploymentStatus {
    EMPLOYED = 'employed',
    UNEMPLOYED = 'unemployed',
    SELFEMPLOYED = 'selfemployed'

}

export enum BusinessType {
    BUSINESS_2_CONSUMER = 'business 2 Consumer',
    BUSINESS_2_BUSINESS = 'business 2 business',
    FMCG = 'fmcg',
    TELECOM = 'telecom',
    TECHNOLOGY = 'technology',
    BUSINESS_2_GOVERMENT = 'business 2 Government',
    CONSUMER_2_CONSUMER = 'consumer 2 consumer',
    FURNITURE = 'furniture',
    LUXURY = 'luxury',
    CONSUMER_2_GOVERNMENT = 'consumer 2 Government',
    FASHION_AND_APPAREL = 'fashion and Apparel',
    HEALTH_AND_BEAUTY = 'health & beaulty'

}

export type KycAttributes = {
    id?: string;
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
    kycStep?: number;
    businessName?: string;
    businessType?: string;  //enum
    businessAddress?: string;
    businessPostcode?: string;
    businessCountry?: string;
    businessCity?: string;
    bank?: string;
    userId: string;

}


export type KycCreateAttributes = Optional<KycAttributes, 'id'>

@Table({
    modelName: 'kyc'
})
export class Kyc extends Model<KycAttributes, KycCreateAttributes> {
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
    title: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
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
        allowNull: false,
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
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0
    })
    kycStep?: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    businessName?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    businessType?: string;  //enum
    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    businessAddress?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    businessPostcode?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    businessCountry?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    businessCity?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    bank?: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        onUpdate: 'CASCADE',
        type: DataType.UUID,
         })
    userId: string
}