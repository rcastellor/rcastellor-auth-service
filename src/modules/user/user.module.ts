import { Module } from '@nestjs/common';
import { PackagesController } from './packages/packages.controller';

@Module({
  controllers: [PackagesController]
})
export class UserModule {}
