import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { UserType } from 'src/storage/postgres/user.schema';

@Injectable()
export class AdminRouteGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.user.userType === UserType.ADMIN;
  }
}
