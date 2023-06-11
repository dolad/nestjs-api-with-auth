import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.services';
import { UpdateBusinessInformationDTO } from '../../business-information/dto/business-info.dto';
import { BusinessInformationServices } from '../../business-information/services/business-info.services';
import { User, UserType } from '../../storage/postgres/user.schema';
import {
  BUSINESS_ENTITY_REPOSITORY,
  PATNER_REPOSITORY,
  USER_REPOSITORY,
} from '../../utils/constants';
import { AddUserToBusinessEntity } from '../dto/add-user.dto';
import {
  ChangePasswordPayload,
  UpdateCreatorDetails,
} from '../dto/update-user-password.dto';
import { IAuthUser } from '../types/user.types';
import { UserSession } from '../../storage/postgres/user-session.schema';
import { BusinessEntity } from '../../storage/postgres/business-entity.schema';
import { IEmailNotification } from '../../notification/interface/email-notification.interface';
import { NotificationService } from '../../notification/notification.service';
import { AddPatnerDTO } from '../../admin/user/dto/add-bank.dto';
import { Partner } from '../../storage/postgres/partner.schema';
import { UpdatePatnerInformationDTO } from 'src/admin/user/dto/updateProvider.dto';
import {
  FundingPartnerResponse,
  GetFundingParterParam,
} from '../interface/get-funding-partner';
import { Op } from 'sequelize';
import { getPaginationParams } from 'src/utils/pagination';

@Injectable()
export class UserServices {
  constructor(
    @Inject(USER_REPOSITORY) private userRepos: typeof User,
    private readonly businessInfoService: BusinessInformationServices,
    @Inject(BUSINESS_ENTITY_REPOSITORY)
    private readonly businessEntityRepo: typeof BusinessEntity,
    private readonly authServices: AuthService,
    private readonly notificationService: NotificationService,
    @Inject(PATNER_REPOSITORY)
    private readonly partnerModel: typeof Partner,
  ) {}
  async findByEmail(email: string): Promise<User> {
    return await this.userRepos.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async findByEmailOrFailed(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async enableTwoFaAuth(
    user: IAuthUser,
    twoFactorAuth: string,
  ): Promise<string> {
    const userTwoFaEnable = await this.userRepos.findOne({
      where: {
        email: user.email,
      },
    });

    if (userTwoFaEnable.twoFactorAuth) {
      return 'Two Factor Already Enabled for this Stream Already';
    }
    userTwoFaEnable.twoFactorAuth = twoFactorAuth;
    userTwoFaEnable.save();
    return 'Two Factor Authentication Enabled Succesfully';
  }

  async findById(id: string): Promise<User> {
    return await this.userRepos.scope('removeSensitivePayload').findByPk(id);
  }

  async getUserSession(user: IAuthUser): Promise<UserSession[]> {
    return await this.authServices.getUserSessions(user);
  }

  async changePassword(
    payload: ChangePasswordPayload,
    user: IAuthUser,
  ): Promise<string> {
    const verifyOldPassword = await this.userRepos.findByPk(user.userId);
    const isOldPasswordCorrect = await verifyOldPassword.isPasswordCorrect(
      payload.oldPassword,
    );
    if (!isOldPasswordCorrect)
      throw new ForbiddenException('Old password is not correct');
    await verifyOldPassword.updatePassword(
      verifyOldPassword,
      payload.newPassword,
    );
    return 'Password Updated Successfull';
  }

  async updateCreatorDetails(
    payload: UpdateCreatorDetails,
    user: IAuthUser,
  ): Promise<string> {
    await this.userRepos.update(
      {
        ...payload,
      },
      {
        where: {
          id: user.userId,
        },
      },
    );

    return 'Creator Updated Successfully';
  }

  async addBusinessEntityUser(
    payload: AddUserToBusinessEntity,
    user: IAuthUser,
  ): Promise<string> {
    const creator = await this.userRepos.findOne({
      where: {
        id: user.userId,
        userType: UserType.BUSINESS,
      },
    });

    if (!creator.businessEntityId) {
      throw new ForbiddenException('user has not add a business');
    }
    const userExist = await this.userRepos.findOne({
      where: {
        email: payload.email,
      },
    });
    if (userExist) throw new ForbiddenException('User already exist');
    const createNewUser = await this.userRepos.create({
      ...payload,
      businessEntityId: creator.businessEntityId,
      userType: UserType.VEIWER,
    });

    await this.authServices.sendRegistrationToken(createNewUser);
    return 'User Added Successfully';
  }

  async getEntityUser(user: IAuthUser): Promise<User[]> {
    const businessEntity = await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
      },
    });

    if (!businessEntity) {
      throw new BadRequestException(
        'this user does not have any business attached to it',
      );
    }

    const getAllUserEntities = await this.userRepos.findAll({
      where: {
        businessEntityId: businessEntity.id,
      },
    });

    return getAllUserEntities;
  }

  async updateBusinessInfo(
    payload: UpdateBusinessInformationDTO,
    user: IAuthUser,
  ): Promise<string> {
    await this.businessInfoService.update(payload);
    return 'Business entity Updated succesfully';
  }

  async getAdminUsers(): Promise<User[]> {
    const admins = await this.userRepos
      .scope('removeSensitivePayload')
      .findAll({
        where: {
          userType: UserType.ADMIN,
        },
      });
    return admins;
  }

  async addAdminUser(payload: AddUserToBusinessEntity): Promise<string> {
    const { lastName, firstName, email, password } = payload;
    const userExist = await this.findByEmail(email);
    if (userExist)
      throw new ConflictException('User with this email already exist');
    const regPassword = password
      ? password
      : (Math.random() + 1).toString(36).substring(6);
    const user = await this.userRepos.create({
      lastName: lastName,
      firstName: firstName,
      email: email,
      password: regPassword,
      isConfirmed: true,
      userType: UserType.ADMIN,
    });

    const emailPayload: IEmailNotification = {
      type: 'ADMIN_USER_CREATED',
      to: user.email,
      adminUserEmaiVerification: {
        context: {
          firstName: user.firstName,
          password: regPassword,
        },
      },
    };

    await this.notificationService.sendCreateAdminUserEmail(emailPayload);
    return 'Admin account created';
  }

  async addPatner(payload: AddPatnerDTO): Promise<{ id: string }> {
    const partnerExist = await this.partnerModel.findOne({
      where: {
        providerName: payload.providerName.toLowerCase(),
        email: payload.email.toLowerCase(),
      },
    });

    if (partnerExist) {
      throw new ConflictException('Provider already exist');
    }

    const password = (Math.random() + 1).toString(36).substring(6);

    const partner = await this.partnerModel.create({
      providerName: payload.providerName.toLowerCase(),
      password,
      ...payload,
    });

    const emailPayload: IEmailNotification = {
      type: 'PARTNER_USER_CREATED',
      to: partner.email.toLowerCase(),
      partnerUserEmailVerification: {
        context: {
          providerName: partner.providerName,
          password,
        },
      },
    };

    await this.notificationService.sendCreatePartnerUserEmail(emailPayload);

    return {
      id: partner.id,
    };
  }

  async updatePartnerInformation(
    payload: UpdatePatnerInformationDTO,
    partnerId: string,
  ): Promise<string> {
    const partnerExist = await this.partnerModel.findByPk(partnerId);
    if (!partnerExist) throw new NotFoundException('Partner does not exist');
    if (payload.businessTypes) {
      payload.businessTypes = partnerExist.businessTypes.concat(
        payload.businessTypes,
      );
    }

    await this.partnerModel.update(
      {
        ...payload,
      },
      {
        where: {
          id: partnerId,
        },
      },
    );

    return 'Partner Information updated successfully';
  }

  async fetchFundingPartner(
    payload: GetFundingParterParam,
  ): Promise<FundingPartnerResponse> {
    const { businessType } = payload;
    const { rows, offset, page } = getPaginationParams({
      rows: payload.rows,
      page: payload.page,
    });

    const whereOption: Record<string, any> = {};
    if (businessType) {
      whereOption.businessTypes = {
        [Op.contains]: [businessType],
      };
    }
    const options = {
      where: whereOption,
      offset,
      limit: rows,
      attributes: [
        'interestRate',
        'repaymentTime',
        'maximumLoanAmount',
        'minimumLoanAmount',
        'minimumAnnualTurnOver',
        'providerName',
        'id',
      ],
    };

    const fundingPatner: { rows: Partner[]; count: number } =
      await this.partnerModel
        .scope('removeSensitivePayload')
        .findAndCountAll(options);

    const totalPages = Math.ceil(fundingPatner.count / rows) || 0;

    return {
      page,
      totalPages,
      rows: fundingPatner.rows,
      count: fundingPatner.count,
    };
  }
}
