import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { PassportStrategy } from '@nestjs/passport/dist/passport/passport.strategy';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configServer: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServer.get('JWT_SECRET'),
    });
  }

  async validate(payload: User) {
    return { id: payload.id, email: payload.email };
  }
}
