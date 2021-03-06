import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as httpMocks from 'node-mocks-http';
import { SigninController } from './signin.controller';

import { FakeUserRepository } from '../persistence/repositories/fake-user.repository';
import { LocalStrategy } from './local.strategy';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthUser } from '../../domain/auth-user.entity';
import { IUserRepository } from '../../domain/user.repository';
import { FakeTokenRepository } from '../persistence/repositories/fake-token.repository';
import { AuthToken } from '../../domain/auth-token.entity';
import { UserStatus } from '../../domain/value-object/auth-user-status';
import { PlainPasswordSecure } from '../services/plain-password-secure.service';
import { CookieGeneratorService } from '../services/cookie-generator.service';

import * as providers from '../providers';
import authTokenDuration from '../config/token.config';



describe('SigninController', () => {
  let controller: SigninController;
  let repository: IUserRepository;
  let cookieService: CookieGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'TODO',
          signOptions: { expiresIn: '3600s' },
        }),
        SharedModule,
        ConfigModule,
        ConfigModule.forFeature(authTokenDuration)
      ],
      providers: [
        {
          provide: providers.UserRepository,
          useClass: FakeUserRepository,
        },
        {
          provide: providers.TokenRepository,
          useClass: FakeTokenRepository,
        },
        {
          provide: providers.PasswordSecure,
          useClass: PlainPasswordSecure,
        },
        LocalStrategy,
        CookieGeneratorService
      ],
      controllers: [SigninController],
    }).compile();

    controller = module.get<SigninController>(SigninController);
    repository = module.get<IUserRepository>('UserRepository');
    cookieService = module.get<CookieGeneratorService>(CookieGeneratorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sould set response status code to 200 on success auth', () => {
    const req = httpMocks.createRequest();
    const user = AuthUser.fromPrimitives({
      uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
      username: 'username',
      password: 'password',
      email: 'email@gmail.com',
      status: UserStatus.ACTIVE,
    });

    repository.save(user);
    const token = AuthToken.create(AuthToken.randomid(), user.uuid);
    req.user = { user, token };
    const res = httpMocks.createResponse();
    controller.signin({ username: 'username', password: 'password' }, req, res);
    expect(res.statusCode).toBe(200);
    expect(res.cookies[cookieService.cookieName]).toBeDefined();
  })

});
