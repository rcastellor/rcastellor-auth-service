import { Body, Controller, HttpException, HttpStatus, Inject, Post, Request, Res } from '@nestjs/common';
import { IPasswordSecure } from '../../domain/password-secure.interface';
import { Signup } from '../../application/signup.service';
import { IUserRepository } from '../../domain/user.repository';
import { ITokenRepository } from '../../domain/token.repository';
import { Refresh } from '../../application/refresh.service';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from '../../domain/auth-token.entity';

@Controller('refresh')
export class RefreshController {

    constructor(@Inject('TokenRepository') private tokenRepository: ITokenRepository,
                    private jwtService: JwtService) {}

    @Post()
    async refresh(@Request() req, @Res() res) {
        const result = await new Refresh(this.tokenRepository)
                                .execute(req.cookies['TE-refresh-token']);
        if(!result.result) {
            res.clearCookie('TE-refresh-token');
            res.sendStatus(401);
            return;
        }
        const token = result.data as AuthToken;
        res.cookie('TE-refresh-token', token.uuid.value, {
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
