import { Optional } from 'sequelize';
import { Column, DataType, Table, Model } from 'sequelize-typescript';
import {
  FundingRepaymentStatus,
  FundingTransationStatus,
} from 'src/config/interface';

export interface FundingRequestTransactionAttributes {
  id?: string;
  providerId: string;
  businessEntityId: string;
  requestAmount: number;
  issuedAmount: number;
  fundingStatus: FundingTransationStatus;
  approvedBy: string;
  repaymentStatus: FundingRepaymentStatus;
  fundingRequirementId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FundingRequestTransactionCreateAttribute = Optional<
  FundingRequestTransactionAttributes,
  'id'
>;

@Table({
  modelName: 'fundingRequestTransactions',
})
export class FundingRequestTransaction extends Model<
  FundingRequestTransactionAttributes,
  FundingRequestTransactionCreateAttribute
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  providerId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  businessEntityId: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  requestAmount: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  issuedAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: FundingTransationStatus.PENDING,
  })
  fundingStatus: FundingTransationStatus;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: FundingRepaymentStatus.NOT_INITIATED,
  })
  repaymentStatus: FundingRepaymentStatus;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  approvedBy: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fundingRequirementId: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: Date.now(),
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: Date.now(),
  })
  updatedAt: Date;
}
