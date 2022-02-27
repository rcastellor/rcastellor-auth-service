import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { SharedModule } from '../../shared/shared.module';
import { LocalStrategy } from './infrastructure/local.strategy';
import { SigninController } from './infrastructure/signin/signin.controller';
import { FakeUserRepository } from './infrastructure/fake-user.repository';
import { SignupController } from './infrastructure/signup/signup.controller';

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
    SignupController
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: FakeUserRepository,
    },
    LocalStrategy
  ]
})
export class AuthModule {}
