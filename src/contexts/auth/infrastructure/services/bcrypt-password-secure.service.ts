import * as bcrypt from 'bcrypt';
import { IPasswordSecure } from '../../domain/password-secure.interface';

export class BcryptPasswordSecure implements IPasswordSecure {

    saltOrRound = 10;

    async secure(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltOrRound);
    }

    async compare(secure: string, password: string): Promise<boolean> {
        return bcrypt.compare(password, secure);
    }
}