import {  Optional } from "sequelize";
import { Column, DataType, Table, Model, BelongsTo, ForeignKey} from "sequelize-typescript";
import { BusinessEntity } from "./business-entity.schema";


export type FinancialConnectDetailsAttributes = {
    id?: string;
    customerEmail: string;
    customerId: string;
    saltEdgeCustomerId: string;
    saltEdgeIdentifier: string;
    saltCustomerSecret: string;
    businessId: string;
    createdAt: Date;
    updatedAt: Date
}

export type CreateFinancialConnectDetailsAttributes = Optional<FinancialConnectDetailsAttributes, 'id'>

@Table({
    modelName: 'financialConnect'
})
export class FinancialConnectDetails extends Model<FinancialConnectDetailsAttributes, CreateFinancialConnectDetailsAttributes>{
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
    saltEdgeCustomerId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    saltEdgeIdentifier: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    saltCustomerSecret: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      businessId: string;
  
      @Column({
          allowNull: true,
          type: DataType.DATE,
          defaultValue: new Date()
      })
      updatedAt: Date;
  
      @Column({
          allowNull: true,
          type: DataType.DATE,
          defaultValue: new Date()
      })
      createdAt: Date;

}