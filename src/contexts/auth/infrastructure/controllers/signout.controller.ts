import { Controller, Inject, Post, Request, Res } from '@nestjs/common';
import { ITokenRepository } from '../../domain/token.repository';
import { Refresh } from '../../application/refresh.service';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from '../../domain/auth-token.entity';
import { Signout } from '../../application/signout.service';

@Controller('signout')
export class SignoutController {

    constructor(@Inject('TokenRepository') private tokenRepository: ITokenRepository) { }

    @Post()
    async signout(@Request() req, @Res() res) {
        const signout = await new Signout(this.tokenRepository)
            .execute(req.cookies['TE-refresh-token']);
        res.clearCookie('TE-refresh-token');
        res.send();
    }
}
