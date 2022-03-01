import { AuthUser } from '../domain/auth-user.entity';
import { IPasswordSecure } from '../domain/password-secure.interface';
import { IUserRepository } from '../domain/user.repository';
import { Signup } from './signup.service';

import { FakeUserRepository } from '../infrastructure/persistence/repositories/fake-user.repository';
import { PlainPasswordSecure } from '../infrastructure/plain-password-secure.service';
import { UserStatus } from '../domain/value-object/auth-user-status';

describe('Signup', () => {
    let passwordSecure: IPasswordSecure;
    let userRepository: IUserRepository;
    let existingUser: AuthUser;
    let signup: Signup;

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

        signup = new Signup(userRepository, passwordSecure);
    });

    it('should register new user', async () => {
        await expect(signup.execute('c2f78ad2-987f-11ec-a936-00155d2b6976',
            'newuser',
            'password',
            'email@gmail.com')).resolves.toHaveProperty('result', true);

    })
    it('should return failure on existing user uuid', async () => {
        await expect(signup.execute(existingUser.uuid.value,
            'newuser',
            'password',
            'email@gmail.com')).resolves.toHaveProperty('result', false);

    })
    it('should return failure on existing username', async () => {
        await expect(signup.execute('023ccb7a-9881-11ec-b370-00155d2b6976',
            existingUser.username.value,
            'password',
            'email@gmail.com')).resolves.toHaveProperty('result', false);

    })
    it('should fail on invalid uuid', async () => {
        await expect(signup.execute('invalid',
            'test',
            'password',
            'email@gmail.com')).rejects.toThrow();
    })
})