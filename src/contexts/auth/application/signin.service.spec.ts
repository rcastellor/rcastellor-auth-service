import { Signin } from './signin.service';
import { AuthUser } from '../domain/auth-user.entity';
import { FakeUserRepository } from '../infrastructure/persistence/repositories/fake-user.repository';
import { PlainPasswordSecure } from '../infrastructure/services/plain-password-secure.service';
import { IPasswordSecure } from '../domain/password-secure.interface';
import { IUserRepository } from '../domain/user.repository';
import { ITokenRepository } from '../domain/token.repository';
import { FakeTokenRepository } from '../infrastructure/persistence/repositories/fake-token.repository';
import { UserStatus } from '../domain/value-object/auth-user-status';

describe('Signin', () => {
    let passwordSecure: IPasswordSecure;
    let userRepository: IUserRepository;
    let tokenRepository: ITokenRepository;
    let existingUser: AuthUser;
    let signin: Signin;

    beforeEach(async () => {
        passwordSecure = new PlainPasswordSecure();
        existingUser = AuthUser.fromPrimitives({
            uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
            username: 'test',
            password: await passwordSecure.secure('password'),
            email: 'email@gmail.com',
            status: UserStatus.ACTIVE,
        });
        const users = [existingUser];

        userRepository = new FakeUserRepository(users);
        tokenRepository = new FakeTokenRepository();
        signin = new Signin(userRepository, tokenRepository, passwordSecure);
    });

    it('should return success with correct username/password', async () => {
        await expect(signin.execute(existingUser.username.value, 'password')).resolves.toHaveProperty('result', true);
    });
    it('should return failure on no existing user', async () => {
        await expect(signin.execute('test1', 'password')).resolves.toHaveProperty('result', false);
    });
    it('should return failure on wrong password', async () => {
        await expect(signin.execute(existingUser.username.value, 'wrongpassword')).resolves.toHaveProperty('result', false);
    });
})