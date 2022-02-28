import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestCommandBusService } from './shared/infrastructure/nest-command-bus.service';
import { AuthModule } from './contexts/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'ICommandBus',
      useClass: NestCommandBusService
    }
  ],
})
export class AppModule { }

