import {  Optional } from "sequelize";
import { Column, DataType, Table, Model} from "sequelize-typescript";


export type FundingRequirementAttributes = {
    id?: string;
    fundingAmount: number;
    fundingDescription: string;
    paymentPeriod?: string;
    fundingBank?: string;
    numberOfHiredEmployee: number;
    amountSpendOnResearch: number;
    businessId: string;
    
}

export type CreateFundingRequirementAttributes = Optional<FundingRequirementAttributes, 'id'>

@Table({
    modelName: 'fundingRequirement'
})
export class FundingRequirement extends Model<FundingRequirementAttributes, CreateFundingRequirementAttributes>{
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey:true
    })
    id?: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    fundingAmount: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fundingDescription: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    paymentPeriod: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    fundingBank: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
       
    })
    numberOfHiredEmployee: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    amountSpendOnResearch: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    businessId: string;

}