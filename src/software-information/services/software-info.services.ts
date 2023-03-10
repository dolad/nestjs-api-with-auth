import { Inject, Injectable } from '@nestjs/common';
import { SoftwareConnectDetails } from 'src/storage/postgres/software-info.schema';
import { IAuthUser } from 'src/user/types/user.types';
import { SOFTWARE_CONNECT_PROVIDER } from 'src/utils/constants';
import { RutterServices } from './rutter.service';

const CONNECT_SOFTWARE_CONNECT="Software Connected Successfully";


@Injectable()
export class SoftwareInformationServices {
  constructor(
    private readonly rutterServices: RutterServices,
    @Inject(SOFTWARE_CONNECT_PROVIDER)
    private readonly softwareConnect: typeof SoftwareConnectDetails
    ) {}

  async connect(user:IAuthUser, token: string): Promise<string> {
    const response = await this.rutterServices.exchangeToken(token);
    await this.softwareConnect.create({
      customerEmail: user.email,
      customerId: user.userId,
      accessToken: response.data.access_token,
      softwarePlatform:response.data.platform
    })
    return CONNECT_SOFTWARE_CONNECT;

  }

 
}
