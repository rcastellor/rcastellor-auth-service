import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';

import { SharedModule } from '../../shared/shared.module';
import { LocalStrategy } from './infrastructure/controllers/local.strategy';
import { SigninController } from './infrastructure/controllers/signin.controller';
import { SignupController } from './infrastructure/controllers/signup.controller';
import { RefreshController } from './infrastructure/controllers/refresh.controller';
import authDatabaseConfig from './infrastructure/persistence/config/database.config';
import authTokenDuration from './infrastructure/config/token.config';
import { NestAuthConfigService } from './infrastructure/services/nest-auth-config.service';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeormUserRepository } from './infrastructure/persistence/repositories/user.typeorm-repository';
import { TypeormTokenRepository } from './infrastructure/persistence/repositories/token.typeorm-repository';
import { SignoutController } from './infrastructure/controllers/signout.controller';
import { BcryptPasswordSecure } from './infrastructure/services/bcrypt-password-secure.service';
import * as providers from './infrastructure/providers';
import { CookieGeneratorService } from './infrastructure/services/cookie-generator.service';

@Module({
  imports: [
    SharedModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('token.AUTH_SECRET_KEY'),
        signOptions: {
          expiresIn: config.get<number>('token.AUTH_TOKEN_DURATION'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forFeature(authDatabaseConfig),
    ConfigModule.forFeature(authTokenDuration),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({ ...configService.get('database') }),
    })
  ],
  controllers: [
    SigninController,
    SignupController,
    RefreshController,
    SignoutController,
  ],
  providers: [
    {
      provide: providers.UserRepository,
      useFactory: (connection: Connection) => {
        return new TypeormUserRepository(connection);
      },
      inject: [getConnectionToken()]
    },
    {
      provide: providers.TokenRepository,
      useFactory: (connection: Connection) => {
        return new TypeormTokenRepository(connection);
      },
      inject: [getConnectionToken()]
    },
    {
      provide: providers.PasswordSecure,
      useClass: BcryptPasswordSecure,
    },
    {
      provide: 'AuthConfig',
      useClass: NestAuthConfigService,
    },
    LocalStrategy,
    CookieGeneratorService,
  ],
})
export class AuthModule { }
