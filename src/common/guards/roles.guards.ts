import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { RequestUser } from 'src/modules/auth/request-auth.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request: RequestUser = context.switchToHttp().getRequest();

    Logger.debug(roles, 'RolesDecorator');
    Logger.debug(request.user, 'UserInfo');

    if (!roles) {
      return true;
    }
    const status = roles.some((role) => role === request.user.role);

    Logger.debug(status, 'UserRoleIncludedStatus');
    return status;
  }
}
