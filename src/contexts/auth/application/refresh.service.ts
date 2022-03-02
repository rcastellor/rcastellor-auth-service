import { Result } from '../../../shared/domain/result';
import { AuthToken } from '../domain/auth-token.entity';
import { ITokenRepository } from '../domain/token.repository';
import { AuthTokenId } from '../domain/value-object/auth-token-id';

export class Refresh {
    constructor(private tokenRepository: ITokenRepository) {
    }

    async execute(token: string): Promise<Result> {
        let result: Result;
        const tokenUuid = new AuthTokenId(token);
        const authToken = await this.tokenRepository.find(tokenUuid);
        if (!authToken) {
            result = Result.failure('Token not exist');
        } else if (authToken.isValid()) {
            const newToken = AuthToken.create(AuthToken.randomid(), authToken.user);
            await this.tokenRepository.saveAll([authToken.use(), newToken]);
            result = Result.success('Token created', newToken);
        } else if (authToken.isExpired()) {
            result = Result.failure('Token expired');
        } else {
            const tokens = await this.tokenRepository.findValidByUserUuid(authToken.user);
            await this.tokenRepository.saveAll(tokens.map(t => t.invalidate()));
            result = Result.failure('Invalid or Used token');
        }
        return Promise.resolve(result);
    }
}