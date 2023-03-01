import { ConflictException, Inject, Logger, NotFoundException } from '@nestjs/common';
import {
  BUSINESS_ENTITY_REPOSITORY,
  USER_REPOSITORY,
} from '../../utils/constants';
import { BusinessEntity } from '../../storage/postgres/business-entity.schema';
import {
  CreateBusinessEntity,
  AddBusinessOwnerDto,
  UpdateBusinessOwnerDto,
} from '../dto/create-business-owner.dto';
import { Sequelize } from 'sequelize-typescript';
import { User, UserType } from '../../storage/postgres/user.schema';
import { IAuthUser } from '../../user/types/user.types';
import { BusinessInformation } from '../../storage/postgres/business-information.schema';
import { BusinessInformationServices } from 'src/business-information/services/business-info.services';

export class BusinessEntityServices {
  private readonly logger = new Logger(BusinessEntityServices.name);
  constructor(
    @Inject(BUSINESS_ENTITY_REPOSITORY)
    private readonly businessEntityRepo: typeof BusinessEntity,
    private readonly businessInformation: BusinessInformationServices,
    @Inject(USER_REPOSITORY) private userRepos: typeof User,
    private sequelize: Sequelize,
  ) {}

  async createBusinessEntity(
    payload: CreateBusinessEntity,
    user: IAuthUser,
  ): Promise<any> {
    // has business been created before
    let businessEntity;
  
    businessEntity = await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
        kycStep: 1,
      },
    });

    if (businessEntity) {
      throw new ConflictException('User has already completed this stage');
    }
    const tx = await this.sequelize.transaction();
    try {
      // create business entity
      businessEntity = await this.businessEntityRepo.create(
        {
          creator: user.userId,
          kycStep: 1,
        },
        { transaction: tx },
      );
    
      await this.businessInformation.create(
        {
          ...payload,
          businessId: businessEntity.id,
        },
        tx,
      );

      tx.commit();
      this.logger.log('Business entity created');
      return "Kyc Submitted Successfully"
    } catch (error) {
      tx.rollback();
      console.log(error);
      this.logger.error('business entity can not be created');
    }
  }

  async createBusinessOwners(
    payload: AddBusinessOwnerDto[],
    user: IAuthUser,
  ): Promise<any> {
    const tx = await this.sequelize.transaction();
    const buisinessEntity = await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
        kycStep: 1
      },
    });

    if(!buisinessEntity){
      throw new NotFoundException("User has not completed the first kyc");
    }

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

      // update owner
      if (owner) {
        await this.userRepos.update(
          {
            businessEntityId: buisinessEntity.id,
            userType: UserType.BUSINESS_OWNER,
          },
          {
            where: {
              id: owner.id,
            },
            transaction: tx,
          },
        );
      }

      if (!owner) {
        owner = await this.userRepos.create(
          {
            ...ownerPayload,
            userType: UserType.BUSINESS_OWNER,
            businessEntityId: buisinessEntity.id,
          },
          { transaction: tx },
        );
      }

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
      
      // update the businessEntityRepo
     await this.businessEntityRepo.update(
        {
          businessOwner: owner.id,
          kycStep: 2,
        },
        {
          where: {
            id: buisinessEntity.id,
          },
          transaction: tx
        },
      );

      tx.commit();
      this.logger.log('Business entity created');
      return "Updated successfully"
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

  async deleteShareHoldersDetails(shareholdersId: string): Promise<number> {
    return await this.userRepos.destroy({
      where: {
        id: shareholdersId,
      },
    });
  }
}
