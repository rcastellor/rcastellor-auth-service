import { Result } from '../../../shared/domain/result';
import { ITokenRepository } from '../domain/token.repository';
import { AuthTokenId } from '../domain/value-object/auth-token-id';

export class Signout {
    constructor(private tokenRepository: ITokenRepository) {}

    async execute(tokenId: string): Promise<Result> {
        const token = await this.tokenRepository.find(new AuthTokenId(tokenId));
        if(token && token.isValid()) {
            await this.tokenRepository.save(token.expire());
        }        
        return Result.success('Session closed', {});
    }
}