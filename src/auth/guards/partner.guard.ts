import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class PartnerRouteGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return !!request.user.partnerId;
  }
}
