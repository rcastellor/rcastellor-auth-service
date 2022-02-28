import { Signin } from './signin.service';
import { AuthUser } from '../domain/auth-user.entity';
import { FakeUserRepository } from '../infrastructure/fake-user.repository';
import { PlainPasswordSecure } from '../infrastructure/plain-password-secure.service';
import { Result } from '../../../shared/domain/result';
import { IPasswordSecure } from '../domain/password-secure.interface';
import { IUserRepository } from '../domain/user.repository';
import { ITokenRepository } from '../domain/token.repository';
import { FakeTokenRepository } from '../infrastructure/fake-token.repository';

describe('Signin', () => {
    let passwordSecure: IPasswordSecure;
    let userRepository: IUserRepository;
    let tokenRepository: ITokenRepository;
    let user: AuthUser;
    let signin: Signin;

    beforeEach(async () => {
        passwordSecure = new PlainPasswordSecure();
        user = AuthUser.fromPrimitives({
            uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
            username: 'test',
            password: await passwordSecure.secure('password'),
            email: 'email@gmail.com'
        });
        const users = [user];

        userRepository = new FakeUserRepository(users);
        tokenRepository = new FakeTokenRepository();
        signin = new Signin(userRepository, tokenRepository, passwordSecure);
    });

    it('should return success with correct username/password', async () => {
        const credentials = { username: user.username.value, password: 'password'};
        await expect(signin.execute(credentials)).resolves.toHaveProperty('result', true);
    });
    it('should return failure on no existing user', async () => {
        const credentials = { username: 'test1', password: 'password'};
        await expect(signin.execute(credentials)).resolves.toHaveProperty('result', false);
    });
    it('should return failure on wrong password', async () => {
        const credentials = { username: user.username.value, password: 'password1'};
        await expect(signin.execute(credentials)).resolves.toHaveProperty('result', false);
    });
})