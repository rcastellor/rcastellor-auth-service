import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import * as httpMocks from 'node-mocks-http';

import { FakeUserRepository } from '../persistence/repositories/fake-user.repository';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthUser } from '../../domain/auth-user.entity';
import { IUserRepository } from '../../domain/user.repository';
import { FakeTokenRepository } from '../persistence/repositories/fake-token.repository';
import { RefreshController } from './refresh.controller';
import { ITokenRepository } from '../../domain/token.repository';
import { AuthToken } from '../../domain/auth-token.entity';
import { UserStatus } from '../../domain/value-object/auth-user-status';

import * as providers from '../providers';

describe('RefreshController', () => {
  let controller: RefreshController;
  let userRepository: IUserRepository;
  let tokenRepository: ITokenRepository;
  const validToken = AuthToken.randomid();
  const usedToken = AuthToken.randomid();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '3600s' },
        }),
        SharedModule,
      ],
      providers: [
        {
          provide: providers.UserRepository,
          useClass: FakeUserRepository,
        },
        {
          provide: providers.TokenRepository,
          useClass: FakeTokenRepository,
        }
      ],
      controllers: [RefreshController],
    }).compile();

    controller = module.get<RefreshController>(RefreshController);
    userRepository = module.get<IUserRepository>(providers.UserRepository);
    tokenRepository = module.get<ITokenRepository>(providers.TokenRepository);
    const user = AuthUser.fromPrimitives({
      uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
      username: 'rcastellor',
      password: 'password',
      email: 'email@gmail.com',
      status: UserStatus.ACTIVE,
    });


    userRepository.save(user);
    tokenRepository.saveAll([
      AuthToken.create(validToken, user.uuid),
      AuthToken.create(usedToken, user.uuid).use(),
    ]);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sould set response status code to 200 on success auth', async () => {
    const req = httpMocks.createRequest();
    req.cookies['TE-refresh-token'] = validToken.value;
    const res = httpMocks.createResponse();
    await expect(controller.refresh(req, res)).resolves.not.toThrow();
    expect(res.statusCode).toBe(200);
    expect(res.cookies['TE-refresh-token']).toBeDefined();
  });

  it('sould set response status code to 401 on failed auth', async () => {
    const req = httpMocks.createRequest();
    req.cookies['TE-refresh-token'] = usedToken.value;
    const res = httpMocks.createResponse();
    await expect(controller.refresh(req, res)).resolves.not.toThrow();
    expect(res.statusCode).toBe(401);
    expect(res.cookies['TE-refresh-token']).toHaveProperty('value', '');
  });
  it('sould set response status code to 401 on no refresh token', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    await expect(controller.refresh(req, res)).resolves.not.toThrow();
    expect(res.statusCode).toBe(401);
    expect(res.cookies['TE-refresh-token']).toHaveProperty('value', '');
  });
});
