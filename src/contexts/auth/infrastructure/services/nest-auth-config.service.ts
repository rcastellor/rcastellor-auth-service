import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IAuthConfig } from '../../domain/config.interface';

export class NestAuthConfigService implements IAuthConfig {

    constructor(private configService: ConfigService) { }

    tokenDuration(): number {
        return this.configService.get<number>('token.AUTH_TOKEN_DURATION');
    }

}