import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = User>(
    err: any,
    user: User | false,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      console.log(context);
      throw new UnauthorizedException('인증에 실패했습니다.');
    }
    return user as TUser;
  }
}
