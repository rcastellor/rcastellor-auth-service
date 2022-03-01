
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository';
import { IPasswordSecure } from '../../domain/password-secure.interface';
import { Signin } from '../../application/signin.service';
import { Credentials } from '../../domain/credentials.model';
import { ITokenRepository } from '../../domain/token.repository';

import * as providers from '../providers';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(providers.UserRepository) private userRepository: IUserRepository,
    @Inject(providers.TokenRepository) private tokenRepository: ITokenRepository,
    @Inject(providers.PasswordSecure) private passwordSecure: IPasswordSecure) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const result = await new Signin(this.userRepository, this.tokenRepository, this.passwordSecure)
      .execute(new Credentials(username, password));
    if (!result.result) {
      throw new UnauthorizedException();
    }
    return result.data;
  }
}
