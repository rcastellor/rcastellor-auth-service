import { Controller, HttpCode, Inject, Post, Request, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ITokenRepository } from '../../domain/token.repository';
import { Signout } from '../../application/signout.service';

import * as providers from '../providers';
import { CookieGeneratorService } from '../services/cookie-generator.service';


@Controller('signout')
@ApiTags('auth')
export class SignoutController {

    constructor(@Inject(providers.TokenRepository) private tokenRepository: ITokenRepository,
        private cookies: CookieGeneratorService) { }

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Clear session token and logout user.' })
    @ApiResponse({ status: 200, description: 'User sign out.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async signout(@Request() req, @Res() res) {
        if (req.cookies[this.cookies.cookieName]) {
            await new Signout(this.tokenRepository)
                .execute(req.cookies[this.cookies.cookieName]);
        }
        res.clearCookie(this.cookies.cookieName);
        res.send();
    }
}
