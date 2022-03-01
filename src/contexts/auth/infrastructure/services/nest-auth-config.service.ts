import { ConfigService } from '@nestjs/config';

import { IAuthConfig } from '../../domain/config.interface';

export class NestAuthConfigService implements IAuthConfig {

    constructor(private configService: ConfigService) { }

    tokenDuration(): number {
        return this.configService.get<number>('token.AUTH_TOKEN_DURATION');
    }

    refreshDuration(): number {
        return this.configService.get<number>('token.AUTH_REFRESH_DURATION');
    }

    secretKey(): string {
        return this.configService.get<string>('token.AUTH_SECRET_KEY');
    }

}