import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from '../../shared/shared.module';
import { LocalStrategy } from './infrastructure/controllers/local.strategy';
import { SigninController } from './infrastructure/controllers/signin.controller';
import { SignupController } from './infrastructure/controllers/signup.controller';
import { PlainPasswordSecure } from './infrastructure/plain-password-secure.service';
import { RefreshController } from './infrastructure/controllers/refresh.controller';
import authDatabaseConfig from './infrastructure/persistence/config/database.config';
import authTokenDuration from './infrastructure/config/token.config';
import { NestAuthConfigService } from './infrastructure/services/nest-auth-config.service';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeormUserRepository } from './infrastructure/persistence/repositories/user.typeorm-repository';
import { Connection, getConnection } from 'typeorm';
import { TypeormTokenRepository } from './infrastructure/persistence/repositories/token.typeorm-repository';

@Module({
  imports: [
    SharedModule,
    PassportModule,
    JwtModule.register({
      secret: 'TODO',
      signOptions: { expiresIn: '3600s' },
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
  ],
  providers: [
    {
      provide: 'UserRepository',
      useFactory: (connection: Connection) => {
        return new TypeormUserRepository(connection);
      },
      inject: [getConnectionToken()]
    },
    {
      provide: 'TokenRepository',
      useFactory: (connection: Connection) => {
        return new TypeormTokenRepository(connection);
      },
      inject: [getConnectionToken()]
    },
    {
      provide: 'PasswordSecure',
      useClass: PlainPasswordSecure,
    },
    {
      provide: 'AuthConfig',
      useClass: NestAuthConfigService,
    },
    LocalStrategy
  ]
})
export class AuthModule { }
