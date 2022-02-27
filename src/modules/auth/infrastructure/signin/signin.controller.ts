import { Controller,Post, Request, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from '../local-auth.guard';

@Controller('signin')
export class SigninController {

    constructor(private jwtService: JwtService) {}

    @UseGuards(LocalAuthGuard)
    @Post()
    async signin(@Request() req, @Res() res) {
        const user = req.user;
        res.cookie('TE-refresh-token', this.jwtService.sign({sub: user.uuid.value}), {
            expires: new Date(new Date().getTime() + 2 * 30 * 24 * 60 * 1000),
            domain: 'localhost',
            sameSite: 'none',
            httpOnly: true,
        });
        const payload = { sub: user.uuid, username: user.username, };
        res.send({
            access_token: this.jwtService.sign(payload),
            id_token: this.jwtService.sign(payload),
        });
    }
}
