import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { SharedModule } from '../../shared/shared.module';
import { LocalStrategy } from './infrastructure/controllers/local.strategy';
import { SigninController } from './infrastructure/controllers/signin.controller';
import { FakeUserRepository } from './infrastructure/fake-user.repository';
import { SignupController } from './infrastructure/controllers/signup.controller';
import { PlainPasswordSecure } from './infrastructure/plain-password-secure.service';
import { FakeTokenRepository } from './infrastructure/fake-token.repository';
import { RefreshController } from './infrastructure/controllers/refresh.controller';

@Module({
  imports: [
    SharedModule,
    PassportModule,
    JwtModule.register({
      secret: 'TODO',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [
    SigninController,
    SignupController,
    RefreshController,
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: FakeUserRepository,
    },
    {
      provide: 'TokenRepository',
      useClass: FakeTokenRepository,
    },
    {
      provide: 'PasswordSecure',
      useClass: PlainPasswordSecure,
    },
    LocalStrategy
  ]
})
export class AuthModule {}
