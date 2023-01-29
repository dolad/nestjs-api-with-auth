import {  Optional } from "sequelize";
import { Column, DataType, Table, Model} from "sequelize-typescript";


export type BusinessTypeAttribute = {
    id?: string;
    name: string;

}

export type BusinessTypeCreateAttributes = Optional<BusinessTypeAttribute, 'id'>

@Table({
    modelName: 'businessTypes'
})
export class BusinessType extends Model<BusinessTypeAttribute, BusinessTypeCreateAttributes>{
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
    name: string;

}