import { Controller, HttpCode, Inject, Post, Request, Res } from '@nestjs/common';
import { ITokenRepository } from '../../domain/token.repository';
import { Signout } from '../../application/signout.service';

import * as providers from '../providers';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('signout')
@ApiTags('auth')
export class SignoutController {

    constructor(@Inject(providers.TokenRepository) private tokenRepository: ITokenRepository) { }

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Clear session token and logout user.' })
    @ApiResponse({ status: 200, description: 'User sign out.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async signout(@Request() req, @Res() res) {
        await new Signout(this.tokenRepository)
            .execute(req.cookies['TE-refresh-token']);
        res.clearCookie('TE-refresh-token');
        res.send();
    }
}
