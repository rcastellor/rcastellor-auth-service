import { Body, Controller, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { IPasswordSecure } from '../../domain/password-secure.interface';
import { Signup } from '../../application/signup.service';
import { IUserRepository } from '../../domain/user.repository';

import * as providers from '../providers';
import { SignupDto } from './dto/signup.dto';


@Controller('signup')
@ApiTags('auth')
export class SignupController {

    constructor(@Inject(providers.UserRepository) private userRepository: IUserRepository,
        @Inject(providers.PasswordSecure) private passwordSecure: IPasswordSecure) { }

    @Post()
    @ApiOperation({ summary: 'Sign up a new user.' })
    @ApiResponse({ status: 201, description: 'User created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 409, description: 'Conflict.' })
    async signup(@Body() signupDto: SignupDto) {
        const { uuid, username, password, email } = signupDto;
        const result = await new Signup(this.userRepository, this.passwordSecure)
            .execute(uuid, username, password, email);
        if (!result.result) {
            throw new HttpException(result.message, HttpStatus.CONFLICT);
        }
    }
}
