import {  Optional } from "sequelize";
import { Column, DataType, Table, Model} from "sequelize-typescript";


export type BankProviderAttributes = {
    id?: string;
    name: string;
    code: string;
    homeUrl: string;
    loginUrl: string;
    logoUrl: string;
    
}

export type BankProviderCreateAttributes = Optional<BankProviderAttributes, 'id'>

@Table({
    modelName: 'bankProvider'
})
export class BankProvider extends Model<BankProviderAttributes, BankProviderCreateAttributes>{
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

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    homeUrl: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    loginUrl: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    logoUrl: string;

}