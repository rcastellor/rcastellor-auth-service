import { Injectable } from '@nestjs/common';
import { IPasswordSecure } from '../domain/password-secure.interface';

@Injectable()
export class PlainPasswordSecure implements IPasswordSecure {

    secure(password: string): Promise<string> {
        return Promise.resolve(password);
    }
}