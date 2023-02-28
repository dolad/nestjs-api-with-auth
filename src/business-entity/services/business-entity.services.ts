import { Inject, Logger } from '@nestjs/common';
import {
  BUSINESS_ENTITY_REPOSITORY,
  USER_REPOSITORY,
} from '../../utils/constants';
import { BusinessEntity } from '../../storage/postgres/business-entity.schema';
import {
  CreateBusinessOwnerDto,
  UpdateBusinessOwnerDto,
} from '../dto/create-business-owner.dto';
import { Sequelize } from 'sequelize-typescript';
import { User, UserType } from '../../storage/postgres/user.schema';
import { IAuthUser } from '../../user/types/user.types';
import { BusinessInformation } from '../../storage/postgres/business-information.schema';

export class BusinessEntityServices {
  private readonly logger = new Logger(BusinessEntityServices.name);
  constructor(
    @Inject(BUSINESS_ENTITY_REPOSITORY)
    private readonly businessEntityRepo: typeof BusinessEntity,
    @Inject(USER_REPOSITORY) private userRepos: typeof User,
    private sequelize: Sequelize,
  ) {}

  async createBusinessOwners(
    payload: CreateBusinessOwnerDto[],
    user: IAuthUser,
  ): Promise<any> {
    const tx = await this.sequelize.transaction();
    try {
      // onwer should be recieve as the first element
      const ownerPayload = payload.shift();

      let owner: User;
      // fetch if owner exist or created
      owner = await this.userRepos.findOne({
        where: {
          lastName: ownerPayload.lastName,
          firstName: ownerPayload.firstName,
          gender: ownerPayload.gender,
        },
      });

      if (!owner) {
        owner = await this.userRepos.create(
          {
            ...ownerPayload,
          },
          { transaction: tx },
        );
      }
      // create business entity
      const buisinessEntity = await this.businessEntityRepo.create(
        {
          businessOwner: owner.id,
          creator: user.userId,
          kycStep: 1,
        },
        { transaction: tx },
      );

      // create other share holders
      if (payload.length) {
        const otherShareholders = payload.map((user) => {
          return {
            ...user,
            userType: UserType.SHAREHOLDER,
            businessEntityId: buisinessEntity.id,
          };
        });
        await this.userRepos.bulkCreate(otherShareholders, { transaction: tx });
      }
      // update owner details
      owner.businessEntityId = buisinessEntity.id;
      owner.userType = UserType.BUSINESS_OWNER;
      owner.save();
      tx.commit();
      this.logger.log('Business entity created');
      return await this.businessEntityRepo.findByPk(buisinessEntity.id);
    } catch (error) {
      tx.rollback();
      console.log(error);
      this.logger.error('business entity can not be created');
    }
  }

  async fetchBusinessEntity(user: IAuthUser): Promise<BusinessEntity> {
    return await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
      },
      include: [User, BusinessInformation],
    });
  }

  async updateShareHoldersDetails(
    shareholdersId: string,
    updateDetails: UpdateBusinessOwnerDto,
  ): Promise<[affectedCount: number]> {

    return await this.userRepos.update(
      {
        ...updateDetails,
      },
      {
        where: {
          id: shareholdersId,
        },
      },
    );
  }

  async deleteShareHoldersDetails(
    shareholdersId: string,
  ): Promise< number> {
    return await this.userRepos.destroy({where:{
        id: shareholdersId
    }})
  }
}
