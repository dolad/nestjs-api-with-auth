import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  BUSINESS_ENTITY_REPOSITORY,
  BUSINESS_INFORMATION_REPOSITORY,
  BUSINESS_OWNER,
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
import { BusinessOwners } from 'src/storage/postgres/business-owners.dto';

@Injectable()
export class BusinessEntityServices {
  private readonly logger = new Logger(BusinessEntityServices.name);
  constructor(
    @Inject(BUSINESS_ENTITY_REPOSITORY)
    private readonly businessEntityRepo: typeof BusinessEntity,
    @Inject(BUSINESS_INFORMATION_REPOSITORY)
    private readonly businessInformationRepo: typeof BusinessInformation,
    @Inject(USER_REPOSITORY) private userRepos: typeof User,
    @Inject(BUSINESS_OWNER) private businessRepo: typeof BusinessOwners,
    private sequelize: Sequelize,
  ) {}

  async createBusinessEntity(
    payload: CreateBusinessEntity,
    user: IAuthUser,
  ): Promise<any> {
    
    
   const  businessEntityExist = await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
        kycStep: 1,
      },
    });

    if (businessEntityExist) {
      throw new ConflictException('User has already completed this stage');
    }
    try {
      // create business entity
       await this.sequelize.transaction(async (t) => {
       
        const businessEntity = await this.businessEntityRepo.create(
          {
            creator: user.userId,
            kycStep: 1,
          },
          { transaction: t },
        );

        await this.userRepos.update({
          businessEntityId: businessEntity.id
        },{
          where: {
            email: user.email
          },
          transaction: t
        })

        

        await this.businessInformationRepo.create(
          {
            ...payload,
            businessId: businessEntity.id,
          },
          {transaction: t},
        );

      })
      
      this.logger.log('Business entity created');
      return 'Kyc Submitted Successfully';
    } catch (error) {
      this.logger.error('business entity can not be created');
      throw new Error("Failed to create buisiness entity");
      
    }
  }

  async createBusinessOwners(
    payload: AddBusinessOwnerDto[],
    user: IAuthUser,
  ): Promise<any> {
    const buisinessEntity = await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
        kycStep: 1,
      },
    });

    if (!buisinessEntity) {
      throw new NotFoundException('User has not completed the first kyc');
    }

    const ownerResponse = await this.createNewOwner(payload, user);
    return ownerResponse
  }

  async createNewOwner(payload: AddBusinessOwnerDto[], user: IAuthUser) : Promise<string> {
    const tx = await this.sequelize.transaction();

    const buisinessEntity = await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
      },
    });

    if (!buisinessEntity) {
      throw new NotFoundException('User has not completed the first kyc');
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

      // update owner
      if (owner) {
        await this.userRepos.update(
          {
            businessEntityId: buisinessEntity.id,
            userType: UserType.BUSINESS_OWNER,
            ...ownerPayload
          },
          {
            where: {
              id: owner.id,
            },
            transaction: tx,
          },
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
          transaction: tx,
        },
      );

      tx.commit();
      this.logger.log('Business entity created');
      return 'Updated successfully';
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
