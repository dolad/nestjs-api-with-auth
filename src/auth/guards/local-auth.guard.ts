import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext):  Promise<any>  {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        console.log(request.body);
        await super.logIn(request);
        return result;
    }
}