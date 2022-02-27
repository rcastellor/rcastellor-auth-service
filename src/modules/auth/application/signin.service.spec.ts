import { Signin } from './signin.service';
import { AuthUser } from '../domain/auth-user.entity';
import { FakeUserRepository } from '../infrastructure/fake-user.repository';
import { PlainPasswordSecure } from '../../../shared/infrastructure/plain-password-secure.service';
import { Result } from '../../../shared/domain/result';

describe('Signin', () => {
    it('should return the user', async () => {
        const user = AuthUser.fromPrimitives({
            uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
            username: 'rcastellor',
            password: 'password',
            email: 'email@gmail.com'
        });
        const users = [user];

        const fakeUserRepository = new FakeUserRepository(users);
        const passwordSecure = new PlainPasswordSecure();

        const signin = new Signin(fakeUserRepository, passwordSecure);
        const credentials = { username: 'rcastellor', password: 'password'};
        const result = Result.success('User logged', user);
        expect(await signin.execute(credentials)).toEqual(result);

    })
    it('should return null on no existing user', async () => {
        const user = AuthUser.fromPrimitives({
            uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
            username: 'rcastellor',
            password: 'password',
            email: 'email@gmail.com'
        });
        const users = [user];

        const fakeUserRepository = new FakeUserRepository(users);
        const passwordSecure = new PlainPasswordSecure();

        const signin = new Signin(fakeUserRepository, passwordSecure);
        const credentials = { username: 'rcastellor1', password: 'password'};
        const result = Result.failure('Authentication error');
        expect(await signin.execute(credentials)).toEqual(result);
    })
    it('should return null on wrong password', async () => {
        const user = AuthUser.fromPrimitives({
            uuid: '4a2e8a62-9710-11ec-9895-00155d2b6bf4',
            username: 'rcastellor',
            password: 'password',
            email: 'email@gmail.com'
        });
        const users = [user];

        const fakeUserRepository = new FakeUserRepository(users);
        const passwordSecure = new PlainPasswordSecure();

        const signin = new Signin(fakeUserRepository, passwordSecure);
        const credentials = { username: 'rcastellor', password: 'password1'};
        const result = Result.failure('Authentication error');
        expect(await signin.execute(credentials)).toEqual(result);
    })
})