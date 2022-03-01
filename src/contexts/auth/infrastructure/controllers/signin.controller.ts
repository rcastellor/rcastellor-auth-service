import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthToken } from '../../domain/auth-token.entity';
import { AuthUser } from '../../domain/auth-user.entity';
import { SigninDTO } from './dto/signin.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('signin')
@ApiTags('auth')
export class SigninController {

    constructor(private jwtService: JwtService) { }

    @UseGuards(LocalAuthGuard)
    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Sign in.' })
    @ApiResponse({ status: 200, description: 'User authenticated.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Authentication failed' })

    signin(@Body() _: SigninDTO, @Req() req, @Res() res) {
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
