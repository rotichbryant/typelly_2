import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/services';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(user: any): Promise<any> {
    const findUser = await this.authService.findOneByEmail(user.email);
    if (!findUser) {
      throw new UnauthorizedException();
    }
    return findUser;
  }
}