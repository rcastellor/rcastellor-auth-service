import { Controller, HttpCode, Inject, Post, Request, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ITokenRepository } from '../../domain/token.repository';
import { Refresh } from '../../application/refresh.service';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from '../../domain/auth-token.entity';

import * as providers from '../providers';
import { CookieGeneratorService } from '../services/cookie-generator.service';


@Controller('refresh')
@ApiTags('auth')
export class RefreshController {

    constructor(
        @Inject(providers.TokenRepository) private tokenRepository: ITokenRepository,
        private jwtService: JwtService,
        private cookieGenerator: CookieGeneratorService,
    ) { }

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Refresh session cookie' })
    @ApiResponse({ status: 200, description: 'User authenticated.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Authentication failed' })
    async refresh(@Request() req, @Res() res) {
        if (!req.cookies[this.cookieGenerator.cookieName]) {
            res.clearCookie(this.cookieGenerator.cookieName);
            res.sendStatus(401);
            return;
        }
        const result = await new Refresh(this.tokenRepository)
            .execute(req.cookies[this.cookieGenerator.cookieName]);
        if (!result.result) {
            res.clearCookie(this.cookieGenerator.cookieName);
            res.sendStatus(401);
            return;
        }
        const token = result.data as AuthToken;
        res.cookie(this.cookieGenerator.cookieName,
            token.id.value,
            this.cookieGenerator.cookieOptions());
        const payload = { sub: token.user.toString() };
        res.send({
            access_token: this.jwtService.sign(payload),
        });

    }
}
