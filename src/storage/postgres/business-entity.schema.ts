import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  Table,
  Model,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { BusinessInformation } from './business-information.schema';
import { FinancialConnectDetails } from './financial-account';
import { User } from './user.schema';
import { FundingRequest } from './fundingRequest.schema';

export type BusinessEntityAttribute = {
  id?: string;
  shareholders: User[];
  creator: string;
  kycStep?: number;
  businessOwner?: string;
  businessInformation?: BusinessInformation;
  // financeAccounts?: FinancialConnectDetails[];
  // salesSoftwares?: SalesSoftwares;
};

export type BusinessEntityCreateAttributes = Optional<
  BusinessEntityAttribute,
  'id'
>;

@Table({
  modelName: 'businessEntity',
})
export class BusinessEntity extends Model<
  BusinessEntityAttribute,
  BusinessEntityCreateAttributes
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id?: string;

  @HasMany(() => User)
  shareholders: User[];

  @Column({
    type: DataType.STRING,
  })
  creator: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  businessOwner: string;

  @HasOne(() => BusinessInformation)
  businessInformation: BusinessInformation;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  kycStep?: number;

  @HasMany(() => FundingRequest)
  fundingRequests: FundingRequest[];
}
