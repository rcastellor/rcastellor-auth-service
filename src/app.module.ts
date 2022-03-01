import { Module } from '@nestjs/common';
import { AuthModule } from './contexts/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

