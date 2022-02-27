
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../domain/user.repository';
import { IPasswordSecure } from 'src/shared/domain/password-secure.interface';
import { Signin } from '../application/signin.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('UserRepository') private userRepository: IUserRepository,
                @Inject('PasswordSecure') private passwordSecure: IPasswordSecure) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const result = await new Signin(this.userRepository, this.passwordSecure).execute({ username, password});
    if (!result.result) {
      throw new UnauthorizedException();
    }
    return result.data;
  }
}
