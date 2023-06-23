import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  Table,
  BelongsTo,
  Model,
  ForeignKey,
} from 'sequelize-typescript';
import {
  FundingRepaymentStatus,
  FundingTransationStatus,
} from 'src/config/interface';
import { BusinessEntity } from './business-entity.schema';
import { Partner } from './partner.schema';

export type FundingRequestAttributes = {
  id?: string;
  fundingAmount: number;
  fundingDescription: string;
  paymentPeriod?: string;
  numberOfHiredEmployee: number;
  amountSpendOnResearch: number;
  businessEntity?: BusinessEntity;
  bankId: string;
  bankEntity?: Partner;
  businessEntityId: string;
  issuedAmount?: number;
  fundingTransactionStatus?: FundingTransationStatus;
  approvedBy?: string;
  repaymentStatus?: FundingRepaymentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateFundingRequestAttributes = Optional<
  FundingRequestAttributes,
  'id'
>;

@Table({
  modelName: 'fundingRequest',
})
export class FundingRequest extends Model<
  FundingRequestAttributes,
  CreateFundingRequestAttributes
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
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
    type: DataType.FLOAT,
    allowNull: true,
  })
  issuedAmount?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: FundingTransationStatus.PENDING,
  })
  fundingTransactionStatus?: FundingTransationStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  approvedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: FundingRepaymentStatus.NOT_INITIATED,
  })
  repaymentStatus?: FundingRepaymentStatus;

  @ForeignKey(() => BusinessEntity)
  @Column({ type: DataType.UUID, allowNull: true })
  businessEntityId?: string;

  @BelongsTo(() => BusinessEntity)
  businessEntity: BusinessEntity;

  @ForeignKey(() => Partner)
  @Column({ type: DataType.UUID, allowNull: true })
  bankId?: string;

  @BelongsTo(() => Partner)
  bankEntity?: Partner;

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
