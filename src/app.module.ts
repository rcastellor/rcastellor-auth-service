import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestCommandBusService } from './shared/infrastructure/nest-command-bus.service';
import { AuthModule } from './contexts/auth/auth.module';
import { UserModule } from './contexts/user/user.module';

@Module({
  imports: [CqrsModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'ICommandBus',
    useClass: NestCommandBusService
  }],
})
export class AppModule {}

