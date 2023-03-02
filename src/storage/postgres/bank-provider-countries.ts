import {  Optional } from "sequelize";
import { Column, DataType, Table, Model} from "sequelize-typescript";


export type BankProviderCountriesAttributes = {
    id?: string;
    name: string;
    code: string;
}

export type BankProviderCountriesCreateAttributes = Optional<BankProviderCountriesAttributes, 'id'>

@Table({
    modelName: 'bankProviderCountries'
})
export class BankProviderCountries extends Model<BankProviderCountriesAttributes, BankProviderCountriesCreateAttributes>{
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


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    code: string;

}