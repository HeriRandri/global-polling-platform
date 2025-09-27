import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // le token arrive dans Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'dev-secret', // ⚠️ en prod: set via env
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // sera injecté dans req.user
    return { userId: payload.sub, email: payload.email };
  }
}
