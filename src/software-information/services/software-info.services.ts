import { Inject, Injectable } from '@nestjs/common';
import { SoftwareConnectDetails } from '../../storage/postgres/software-info.schema';
import { IAuthUser } from 'src/user/types/user.types';
import { BUSINESS_ENTITY_REPOSITORY, SOFTWARE_CONNECT_PROVIDER } from '../../utils/constants';
import { RutterServices } from './rutter.service';
import { BusinessEntity } from 'src/storage/postgres/business-entity.schema';


const CONNECT_SOFTWARE_CONNECT="Software Connected Successfully";


@Injectable()
export class SoftwareInformationServices {
  constructor(
    private readonly rutterServices: RutterServices,
    @Inject(SOFTWARE_CONNECT_PROVIDER)
    private readonly softwareConnect: typeof SoftwareConnectDetails,
    @Inject(BUSINESS_ENTITY_REPOSITORY)
    private readonly businessEntityRepo: typeof BusinessEntity) {}

  async connect(user:IAuthUser, token: string): Promise<string> {
      const response = await this.rutterServices.exchangeToken(token);
      await this.softwareConnect.create({
        customerEmail: user.email,
        customerId: user.userId,
        accessToken: response.data.access_token,
        softwarePlatform:response.data.platform
      })
      
      await this.businessEntityRepo.update({
        kycStep: 4
      }, {
        where: {
          creator: user.userId
        }
      });
   
      return CONNECT_SOFTWARE_CONNECT;
  
    }
   
}
