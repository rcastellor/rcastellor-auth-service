import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieGeneratorService {

    public readonly cookieName: string;
    private readonly refreshDuration: number;

    constructor(private configService: ConfigService) {
        this.cookieName = this.configService.get<string>('token.AUTH_COOKIE_NAME');
        this.refreshDuration = this.configService.get<number>('token.AUTH_REFRESH_DURATION');
    }


    cookieOptions(): CookieOptions {
        const options: CookieOptions = {
            domain: this.configService.get<string>('token.AUTH_DOMAIN'),
            httpOnly: true,
            sameSite: 'none',
            expires: new Date(new Date().getTime() + this.refreshDuration * 1000)
        }
        return options;
    }

}