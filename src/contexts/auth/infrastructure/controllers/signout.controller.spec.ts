import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { v4 } from 'uuid';
import * as httpMocks from 'node-mocks-http';

import { SharedModule } from '../../../../shared/shared.module';
import { AuthUserUuid } from '../../domain/value-object/auth-user-uuid';
import { SignoutController } from './signout.controller';
import { ITokenRepository } from '../../domain/token.repository';
import { FakeTokenRepository } from '../persistence/repositories/fake-token.repository';
import { AuthToken } from '../../domain/auth-token.entity';
import { AuthTokenStatus, TokenStatus } from '../../domain/value-object/auth-token-status';

import authTokenDuration from '../config/token.config';
import { CookieGeneratorService } from '../services/cookie-generator.service';

import * as providers from '../providers';


describe('SignoutController', () => {
  let controller: SignoutController;
  let cookieService: CookieGeneratorService;
  let tokenRepository: ITokenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule,
        ConfigModule.forRoot(),
        ConfigModule.forFeature(authTokenDuration),
      ],
      controllers: [
        SignoutController
      ],
      providers: [
        {
          provide: providers.TokenRepository,
          useClass: FakeTokenRepository,
        },
        CookieGeneratorService,
      ]
    }).compile();

    controller = module.get<SignoutController>(SignoutController);
    tokenRepository = module.get<ITokenRepository>(providers.TokenRepository);
    cookieService = module.get<CookieGeneratorService>(CookieGeneratorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sould mark token as expired', async () => {
    const tokenId = AuthToken.randomid();
    let token = AuthToken.create(tokenId, new AuthUserUuid(v4()));
    tokenRepository.save(token);
    const req = httpMocks.createRequest();
    req.cookies[cookieService.cookieName] = tokenId.value;
    const res = httpMocks.createResponse();
    await expect(controller.signout(req, res)).resolves.not.toThrow();
    token = await tokenRepository.find(tokenId);
    expect(token.status).toEqual(new AuthTokenStatus(TokenStatus.EXPIRED));
    expect(res.cookies[cookieService.cookieName]).toHaveProperty('value', '');
  });

  it('sould silently run on no existing token', async () => {
    const tokenId = AuthToken.randomid();
    const req = httpMocks.createRequest();
    req.cookies[cookieService.cookieName] = tokenId.value;
    const res = httpMocks.createResponse();
    await expect(controller.signout(req, res)).resolves.not.toThrow();
    expect(res.cookies[cookieService.cookieName]).toHaveProperty('value', '');
  });
  it('sould mark cookie as removed', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    await expect(controller.signout(req, res)).resolves.not.toThrow();
    expect(res.cookies[cookieService.cookieName]).toHaveProperty('value', '');
  });
});
