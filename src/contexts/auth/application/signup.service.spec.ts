import { AuthUser } from '../domain/auth-user.entity';
import { FakeUserRepository } from '../infrastructure/fake-user.repository';
import { PlainPasswordSecure } from '../../../shared/infrastructure/plain-password-secure.service';
import { Signup } from './signup.service';
import { Result } from '../../../shared/domain/result';
import { InvalidArgumentError } from '../../../shared/domain/value-objects/invalid-argument-error';

describe('Signup', () => {
    it('should register new user', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const passwordSecure = new PlainPasswordSecure();

        const user = AuthUser.fromPrimitives({
            uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
            username: 'rcastellor',
            password: await passwordSecure.secure('password'),
            email: 'email@gmail.com'
        });

        const signup = new Signup(fakeUserRepository, passwordSecure);
        const result = Result.success('User created', user);
        expect(await signup.execute('4a2e8a62-9710-11ec-9895-00155d2b6bf4',
                                    'rcastellor',
                                    'password',
                                    'email@gmail.com')).toEqual(result);

    })
    it('should return failure on existing user uuid', async () => {

        const passwordSecure = new PlainPasswordSecure();

        const user = AuthUser.fromPrimitives({
            uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
            username: 'rcastellor',
            password: await passwordSecure.secure('password'),
            email: 'email@gmail.com'
        });
        const users = [user];
        const fakeUserRepository = new FakeUserRepository(users);

        const signup = new Signup(fakeUserRepository, passwordSecure);

        const result = Result.failure('User already exists');;
        expect(await signup.execute('4a2e8a62-9710-11ec-9895-00155d2b6bf4',
                                    'rcastellor',
                                    'password',
                                    'email@gmail.com')).toEqual(result);

    })

    it('should return failure on existing username', async () => {

        const passwordSecure = new PlainPasswordSecure();

        const user = AuthUser.fromPrimitives({
            uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
            username: 'rcastellor',
            password: await passwordSecure.secure('password'),
            email: 'email@gmail.com'
        });
        const users = [user];
        const fakeUserRepository = new FakeUserRepository(users);

        const signup = new Signup(fakeUserRepository, passwordSecure);

        const result = Result.failure('User already exists');
        expect(await signup.execute('a2487a22-97c0-11ec-b2d7-00155d2b666a',
                                    'rcastellor',
                                    'password',
                                    'email@gmail.com')).toEqual(result);

    })

    it('should fail on invalid uuid', async () => {

        const passwordSecure = new PlainPasswordSecure();

        const fakeUserRepository = new FakeUserRepository();

        const signup = new Signup(fakeUserRepository, passwordSecure);

        await expect(signup.execute('4a2e8a62-9710-11ec-9895-00155d2b6bf4s',
                                    'rcastellor',
                                    'password',
                                    'email@gmail.com')).rejects.toThrow(InvalidArgumentError);

    })
})