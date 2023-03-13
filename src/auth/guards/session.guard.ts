import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

export class SessionGuard implements CanActivate {
    async canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated()
    }
}