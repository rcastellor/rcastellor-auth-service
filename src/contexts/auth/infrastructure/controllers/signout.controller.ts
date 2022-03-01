import { Controller, Inject, Post, Request, Res } from '@nestjs/common';
import { ITokenRepository } from '../../domain/token.repository';
import { Signout } from '../../application/signout.service';

@Controller('signout')
export class SignoutController {

    constructor(@Inject('TokenRepository') private tokenRepository: ITokenRepository) { }

    @Post()
    async signout(@Request() req, @Res() res) {
        await new Signout(this.tokenRepository)
            .execute(req.cookies['TE-refresh-token']);
        res.clearCookie('TE-refresh-token');
        res.send();
    }
}
