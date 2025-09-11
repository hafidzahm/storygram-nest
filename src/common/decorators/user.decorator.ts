import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from 'src/modules/auth/request-auth.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: RequestUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
