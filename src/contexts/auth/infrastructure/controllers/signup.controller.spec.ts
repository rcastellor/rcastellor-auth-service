import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { v4 } from 'uuid';
import { SharedModule } from '../../../../shared/shared.module';
import { FakeUserRepository } from '../persistence/repositories/fake-user.repository';
import { SignupController } from './signup.controller';
import { IUserRepository } from '../../domain/user.repository';
import { AuthUser } from '../../domain/auth-user.entity';
import { IPasswordSecure } from '../../domain/password-secure.interface';
import { PlainPasswordSecure } from '../plain-password-secure.service';
import { UserStatus } from '../../domain/value-object/auth-user-status';
import { AuthUsername } from '../../domain/value-object/auth-username';
import { AuthUserUuid } from '../../domain/value-object/auth-user-uuid';

describe('SignupController', () => {
  let controller: SignupController;
  let repository: IUserRepository;
  let passwordSecure: IPasswordSecure;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule
      ],
      controllers: [
        SignupController
      ],
      providers: [
        {
          provide: 'UserRepository',
          useClass: FakeUserRepository,
        },
        {
          provide: 'PasswordSecure',
          useClass: PlainPasswordSecure,
        },
      ]
    }).compile();

    controller = module.get<SignupController>(SignupController);
    repository = module.get<IUserRepository>('UserRepository');
    passwordSecure = module.get<IPasswordSecure>('PasswordSecure');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sould run silently and save user', async () => {
    const username = 'test';
    const uuid = v4();
    const data = {
      uuid,
      username,
      password: 'test',
      email: 'test@gmail.com',
      status: UserStatus.ACTIVE,
    };
    const user = AuthUser.fromPrimitives({ ...data, password: await passwordSecure.secure(data.password) });
    await expect(controller.signup(data)).resolves.not.toThrow();
    await expect(repository.findByUsername(new AuthUsername(username))).resolves.toEqual(user);
    await expect(repository.findByUuid(new AuthUserUuid(uuid))).resolves.toEqual(user);
  });

  it('sould throw exception on existing user', async () => {
    const username = 'test';
    const uuid = v4();
    const data = {
      uuid,
      username,
      password: 'test',
      email: 'test@gmail.com',
      status: UserStatus.ACTIVE,
    };
    const user = AuthUser.fromPrimitives({ ...data, password: await passwordSecure.secure(data.password) });
    await repository.save(user);
    await expect(controller.signup(data)).rejects.toThrow(HttpException);
  });

});
