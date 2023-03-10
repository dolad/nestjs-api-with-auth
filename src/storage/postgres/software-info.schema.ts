import {  Optional } from "sequelize";
import { Column, DataType, Table, Model} from "sequelize-typescript";


export type SoftwareConnectDetailsAttributes = {
    id?: string;
    customerEmail: string;
    customerId: string;
    accessToken: string;
    softwarePlatform?: string;
}

export type CreateSoftwareConnectDetailsAttributes = Optional<SoftwareConnectDetailsAttributes, 'id'>

@Table({
    modelName: 'softwareConnect'
})
export class SoftwareConnectDetails extends Model<SoftwareConnectDetailsAttributes, CreateSoftwareConnectDetailsAttributes>{
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
    customerEmail: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    customerId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    accessToken: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    softwarePlatform?: string;

}