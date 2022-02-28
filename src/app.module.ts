import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestCommandBusService } from './shared/infrastructure/nest-command-bus.service';
import { AuthModule } from './contexts/auth/auth.module';

@Module({
  imports: [
    CqrsModule,
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
export class AppModule {}

