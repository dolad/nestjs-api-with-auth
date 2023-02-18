import {  Optional } from "sequelize";
import { Column, DataType, Table, Model,  BelongsTo, ForeignKey } from "sequelize-typescript";
import { BusinessEntity } from "./business-entity.schema";


export type BusinessInformationAttributes = {
    id?: string;
    businessName?: string;
    businessType?: string;  //enum
    businessAddress?: string;
    businessPostcode?: string;
    businessCountry?: string;
    businessCity?: string;
    businessId: string;
    businessEntity: BusinessEntity

}


export type BusinessInformationCreateAttributes = Optional<BusinessInformationAttributes, 'id'>

@Table({
    modelName: 'businessInformation'
})
export class BusinessInformation extends Model<BusinessInformationAttributes, BusinessInformationCreateAttributes> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey:true
    })
    id: string;

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
        allowNull: true,
        defaultValue: null
    })
    businessCountry?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    businessCity?: string;

    @BelongsTo(() => BusinessEntity)
    businessEntity: BusinessEntity

    @ForeignKey(() => BusinessEntity)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    businessId: string;
}