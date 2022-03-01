import { Test, TestingModule } from '@nestjs/testing';
import { SigninController } from './signin.controller';
import { JwtModule } from '@nestjs/jwt';
import { FakeUserRepository } from '../persistence/repositories/fake-user.repository';
import { LocalStrategy } from './local.strategy';
import * as httpMocks from 'node-mocks-http';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthUser } from '../../domain/auth-user.entity';
import { IUserRepository } from '../../domain/user.repository';
import { PlainPasswordSecure } from '../services/plain-password-secure.service';
import { IPasswordSecure } from '../../domain/password-secure.interface';
import { ITokenRepository } from '../../domain/token.repository';
import { FakeTokenRepository } from '../persistence/repositories/fake-token.repository';
import { UserStatus } from '../../domain/value-object/auth-user-status';

describe('LocalStrategy', () => {
  let userRepository: IUserRepository;
  let tokenRepository: ITokenRepository;
  let passwordSecure: IPasswordSecure;
  let localStrategy: LocalStrategy;
  let user: AuthUser;

  beforeEach(async () => {
    passwordSecure = new PlainPasswordSecure();
    user = AuthUser.fromPrimitives({
      uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
      username: 'test',
      password: await passwordSecure.secure('password'),
      email: 'email@gmail.com',
      status: UserStatus.ACTIVE,
    });
    const users = [user];

    userRepository = new FakeUserRepository(users);
    tokenRepository = new FakeTokenRepository();
    localStrategy = new LocalStrategy(userRepository, tokenRepository, passwordSecure);
  });

  it('should return user on success login', async () => {
    await expect(localStrategy.validate('test', 'password')).resolves.toHaveProperty('user', user);
  });
  it('should throw Unauthorized exception on wrong password', async () => {
    await expect(localStrategy.validate('test', 'password1')).rejects.toThrow();
  });
  it('should throw Unauthorized exception on not existing user', async () => {
    await expect(localStrategy.validate('test1', 'password')).rejects.toThrow();
  })

});
