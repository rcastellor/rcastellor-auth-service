import { Test, TestingModule } from '@nestjs/testing';
import { SigninController } from './signin.controller';
import { JwtModule } from '@nestjs/jwt';
import { FakeUserRepository } from '../fake-user.repository';
import { LocalStrategy } from './local.strategy';
import * as httpMocks from 'node-mocks-http';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthUser } from '../../domain/auth-user.entity';
import { IUserRepository } from '../../domain/user.repository';
import { PlainPasswordSecure } from '../plain-password-secure.service';
import { IPasswordSecure } from '../../domain/password-secure.interface';

describe('LocalStrategy', () => {
  let userRepository: IUserRepository;
  let passwordSecure: IPasswordSecure;
  let localStrategy: LocalStrategy;
  let user: AuthUser;

  beforeEach(async () => {
    passwordSecure = new PlainPasswordSecure();
    user = AuthUser.fromPrimitives({
      uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
      username: 'test',
      password: await passwordSecure.secure('password'),
      email: 'email@gmail.com'
    });
    const users = [user];

    userRepository = new FakeUserRepository(users);
    localStrategy = new LocalStrategy(userRepository, passwordSecure);
  });

  it('should return user on success login', async () => {
    await expect(localStrategy.validate('test', 'password')).resolves.toEqual(user);
  });
  it('should throw Unauthorized exception on wrong password', async () => {
    await expect(localStrategy.validate('test', 'password1')).rejects.toThrow();
  });
  it('should throw Unauthorized exception on not existing user', async () => {
    await expect(localStrategy.validate('test1', 'password')).rejects.toThrow();
  })

});
