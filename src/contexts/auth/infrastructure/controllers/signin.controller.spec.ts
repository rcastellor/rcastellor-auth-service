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

describe('SigninController', () => {
  let controller: SigninController;
  let repository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'TODO',
          signOptions: { expiresIn: '3600s' },
        }),
        SharedModule,
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
        LocalStrategy
      ],
      controllers: [SigninController],
    }).compile();

    controller = module.get<SigninController>(SigninController);
    repository = module.get<FakeUserRepository>('UserRepository');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sould set response status code to 200 on success auth', () => {
    const req = httpMocks.createRequest();
    const user = AuthUser.fromPrimitives({
      uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
      username: 'rcastellor',
      password: 'password',
      email: 'email@gmail.com'
    });

    repository.save(user);
    req.user = user;
    const res = httpMocks.createResponse();
    controller.signin(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.cookies['TE-refresh-token']).toBeDefined();
  })

});
