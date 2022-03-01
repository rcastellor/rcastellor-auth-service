import { Body, Controller, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { IPasswordSecure } from '../../domain/password-secure.interface';
import { Signup } from '../../application/signup.service';
import { IUserRepository } from '../../domain/user.repository';

import * as providers from '../providers';

@Controller('signup')
export class SignupController {

    constructor(@Inject(providers.UserRepository) private userRepository: IUserRepository,
        @Inject(providers.PasswordSecure) private passwordSecure: IPasswordSecure) { }

    @Post()
    async signup(@Body() data: any) {
        const result = await new Signup(this.userRepository, this.passwordSecure)
            .execute(data.uuid, data.username, data.password, data.email);
        if (!result.result) {
            throw new HttpException(result.message, HttpStatus.CONFLICT);
        }
    }
}
