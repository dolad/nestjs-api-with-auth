import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class PartnerRouteGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(!!request.user.partnerId);
    return request.user.partnerId;
  }
}
