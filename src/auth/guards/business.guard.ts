import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { UserType } from 'src/storage/postgres/user.schema';

@Injectable()
export class ClientRouteGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.user.userType === UserType.BUSINESS) {
      return true;
    }
    if (request.user.userType === UserType.BUSINESS_OWNER) {
      return true;
    }
    return false;
  }
}
