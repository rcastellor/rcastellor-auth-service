import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { v4 } from 'uuid';
import * as httpMocks from 'node-mocks-http';

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
import { SignoutController } from './signout.controller';
import { ITokenRepository } from '../../domain/token.repository';
import { FakeTokenRepository } from '../persistence/repositories/fake-token.repository';
import { AuthToken } from '../../domain/auth-token.entity';
import { AuthTokenId } from '../../domain/value-object/auth-token-id';
import { AuthTokenStatus, TokenStatus } from '../../domain/value-object/auth-token-status';

describe('SignoutController', () => {
  let controller: SignoutController;
  let tokenRepository: ITokenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule
      ],
      controllers: [
        SignoutController
      ],
      providers: [
        {
          provide: 'TokenRepository',
          useClass: FakeTokenRepository,
        },
      ]
    }).compile();

    controller = module.get<SignoutController>(SignoutController);
    tokenRepository = module.get<ITokenRepository>('TokenRepository');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sould mark token as expired', async () => {
    const tokenId = AuthToken.randomid();
    let token = AuthToken.create(tokenId, new AuthUserUuid(v4()));
    tokenRepository.save(token);
    const req = httpMocks.createRequest();
    req.cookies['TE-refresh-token'] = tokenId.value;
    const res = httpMocks.createResponse();
    await expect(controller.signout(req, res)).resolves.not.toThrow();
    token = await tokenRepository.find(tokenId);
    expect(token.status).toEqual(new AuthTokenStatus(TokenStatus.EXPIRED));
    expect(res.cookies['TE-refresh-token']).toHaveProperty('value', '');
  });

  it('sould silently run on no existing token', async () => {
    const tokenId = AuthToken.randomid();
    const req = httpMocks.createRequest();
    req.cookies['TE-refresh-token'] = tokenId.value;
    const res = httpMocks.createResponse();
    await expect(controller.signout(req, res)).resolves.not.toThrow();
    expect(res.cookies['TE-refresh-token']).toHaveProperty('value', '');
  });
  it('sould mark cookie as removed', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    await expect(controller.signout(req, res)).resolves.not.toThrow();
    expect(res.cookies['TE-refresh-token']).toHaveProperty('value', '');
  });
});
