import { IPasswordSecure } from '../domain/password-secure.interface';
import { IUserRepository } from '../domain/user.repository';
import { Credentials } from '../domain/credentials.model';
import { Result } from '../../../shared/domain/result';
import { AuthToken } from '../domain/auth-token.entity';
import { ITokenRepository } from '../domain/token.repository';
import { AuthUsername } from '../domain/value-object/auth-username';


export class Signin {

    constructor(private readonly userRepository: IUserRepository,
        private readonly tokenRepository: ITokenRepository,
        private readonly passwordSecure: IPasswordSecure) { }

    async execute(credentials: Credentials): Promise<Result> {
        const user = await this.userRepository.findByUsername(new AuthUsername(credentials.username));
        if (user && await this.passwordSecure.compare(user.password.value, credentials.password)) {
            const token = AuthToken.create(AuthToken.randomid(), user.uuid);
            await this.tokenRepository.save(token);
            return Result.success('User logged', { user, token });
        }
        return Result.failure('Authentication error');
    }

}