import { Module } from '@nestjs/common';
import { PlainPasswordSecure } from './infrastructure/plain-password-secure.service';


@Module({
  providers: [
    {
      provide: 'PasswordSecure',
      useClass: PlainPasswordSecure,
    },
  ],
  exports: [
    {
      provide: 'PasswordSecure',
      useClass: PlainPasswordSecure,
    },
  ]
})
export class SharedModule {}
