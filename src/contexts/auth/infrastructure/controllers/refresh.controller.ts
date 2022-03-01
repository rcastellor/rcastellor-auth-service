import { Controller, HttpCode, Inject, Post, Request, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ITokenRepository } from '../../domain/token.repository';
import { Refresh } from '../../application/refresh.service';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from '../../domain/auth-token.entity';

import * as providers from '../providers';


@Controller('refresh')
@ApiTags('auth')
export class RefreshController {

    constructor(@Inject(providers.TokenRepository) private tokenRepository: ITokenRepository,
        private jwtService: JwtService) { }

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Refresh session cookie' })
    @ApiResponse({ status: 200, description: 'User authenticated.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Authentication failed' })
    async refresh(@Request() req, @Res() res) {
        const result = await new Refresh(this.tokenRepository)
            .execute(req.cookies['TE-refresh-token']);
        if (!result.result) {
            res.clearCookie('TE-refresh-token');
            res.sendStatus(401);
            return;
        }
        const token = result.data as AuthToken;
        res.cookie('TE-refresh-token', token.id.value, {
            expires: new Date(new Date().getTime() + 2 * 30 * 24 * 60 * 1000),
            domain: 'localhost',
            sameSite: 'none',
            httpOnly: true,
        });
        //TODO:
        const payload = { sub: token.user.toString() };
        res.send({
            access_token: this.jwtService.sign(payload),
            id_token: this.jwtService.sign(payload),
        });

    }
}
