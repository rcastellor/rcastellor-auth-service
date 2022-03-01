import { IPasswordSecure } from '../domain/password-secure.interface';
import { IUserRepository } from '../domain/user.repository';
import { Result } from '../../../shared/domain/result';
import { AuthToken } from '../domain/auth-token.entity';
import { ITokenRepository } from '../domain/token.repository';
import { AuthUsername } from '../domain/value-object/auth-username';


export class Signin {

    constructor(private readonly userRepository: IUserRepository,
        private readonly tokenRepository: ITokenRepository,
        private readonly passwordSecure: IPasswordSecure) { }

    async execute(username: string, password: string): Promise<Result> {
        const user = await this.userRepository.findByUsername(new AuthUsername(username));
        if (user && await this.passwordSecure.compare(user.password.value, password)) {
            const token = AuthToken.create(AuthToken.randomid(), user.uuid);
            await this.tokenRepository.save(token);
            return Result.success('User logged', { user, token });
        }
        return Result.failure('Authentication error');
    }

}