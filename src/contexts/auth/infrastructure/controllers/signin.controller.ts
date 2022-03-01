import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from '../../domain/auth-token.entity';
import { AuthUser } from '../../domain/auth-user.entity';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('signin')
export class SigninController {

    constructor(private jwtService: JwtService) { }

    @UseGuards(LocalAuthGuard)
    @Post()
    signin(@Request() req, @Res() res) {
        const user = req.user.user as AuthUser;
        const token = req.user.token as AuthToken;
        res.cookie('TE-refresh-token', token.id.value, {
            expires: new Date(new Date().getTime() + 2 * 30 * 24 * 60 * 1000),
            domain: 'localhost',
            sameSite: 'none',
            httpOnly: true,
        });
        const payload = { sub: user.uuid.toString(), username: user.username.value, };
        res.send({
            access_token: this.jwtService.sign(payload),
            id_token: this.jwtService.sign(payload),
        });
    }
}
