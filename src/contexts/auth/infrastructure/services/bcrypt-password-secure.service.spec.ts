import { IPasswordSecure } from '../../domain/password-secure.interface';
import { BcryptPasswordSecure } from './bcrypt-password-secure.service';

describe('BcryptPasswordSecure', () => {
    let passwordSecure: IPasswordSecure;
    let password = 'test';

    beforeEach(async () => {
        passwordSecure = new BcryptPasswordSecure();
    });

    it('should secure a password', async () => {
        await expect(passwordSecure.secure(password)).resolves.not.toBeNull();
    });
    it('should empty password', async () => {
        await expect(passwordSecure.secure('')).resolves.not.toBeNull();
    });
    it('should null password', async () => {
        await expect(passwordSecure.secure(null)).rejects.toThrow();
    });
    it('should success compare password', async () => {
        const hash = await passwordSecure.secure(password);
        expect(hash).not.toEqual(password);
        await expect(passwordSecure.compare(hash, password)).resolves.toEqual(true);
    });
    it('should fail on wrong compare password', async () => {
        const hash = await passwordSecure.secure('wrongpassword');
        expect(hash).not.toEqual(password);
        await expect(passwordSecure.compare(hash, password)).resolves.toEqual(false);
    });


})