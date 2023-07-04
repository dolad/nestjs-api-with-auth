import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  Table,
  Model,
  AfterCreate,
} from 'sequelize-typescript';
import { HashManager } from 'src/auth/utils/hash';

export interface PartnerAttributes {
  id?: string;
  providerName: string;
  address: string;
  postcode: string;
  country: string;
  email: string;
  password: string;
  city: string;
  businessTypes: string[];
  contactPersonFirstname: string;
  contactPersonLastname: string;
  contactPersonTitle: string;
  contactPersonGender: string;
  contactPersonPosition: string;
  contactPersonDateofBirth: string;
  contactPersonCountry: string;
  contactPersonCity: string;
  contactPersonAddress: string;
  contactPersonPostcode: string;
  minimumLoanAmount: number;
  minimumBusinessEstablishmentPeriod: string;
  maximumLoanAmount: number;
  minimumAnnualTurnOver: number;
  interestRate: number;
  repaymentTime: string;
  logoUrl: string;
  isActive: boolean;
  twoFactorAuth?: string;
  twoFaToken?: string;
  aboutBank?: string;
  fundingRequirement?: string;
}

export type PartnerCreateAttributes = Optional<PartnerAttributes, 'id'>;

const scopes = {
  removeSensitivePayload: {
    attributes: { exclude: ['password'] },
  },
};

@Table({
  scopes,
  modelName: 'partner',
})
export class Partner extends Model<PartnerAttributes, PartnerCreateAttributes> {
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
  providerName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  postcode: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  businessTypes: string[];
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonFirstname: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonLastname?: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonTitle?: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonGender?: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonPosition?: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonDateofBirth?: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonCountry?: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonCity?: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonAddress?: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactPersonPostcode?: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  minimumLoanAmount?: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  minimumBusinessEstablishmentPeriod?: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maximumLoanAmount?: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  minimumAnnualTurnOver?: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  interestRate?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  repaymentTime?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
    defaultValue: null,
  })
  twoFaToken?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
    defaultValue: null,
  })
  twoFactorAuth?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  isActive?: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  logoUrl?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  aboutBank?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  fundingRequirement?: string;

  async isPasswordCorrect(password: string): Promise<boolean> {
    return await new HashManager().bCompare(this.password, password);
  }

  @AfterCreate
  static async hashPassword(user: Partner): Promise<void> {
    const hashPassword = await new HashManager().bHash(user.password);
    user.password = hashPassword;
    await user.save();
  }
  async updatePassword(user: Partner, newPassword: string): Promise<void> {
    const hashPassword = await new HashManager().bHash(newPassword);
    user.password = hashPassword;
    await user.save();
  }
}
