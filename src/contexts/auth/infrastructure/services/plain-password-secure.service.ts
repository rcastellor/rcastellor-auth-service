import { Injectable } from '@nestjs/common';
import { IPasswordSecure } from '../../domain/password-secure.interface';

@Injectable()
export class PlainPasswordSecure implements IPasswordSecure {

    secure(password: string): Promise<string> {
        return Promise.resolve('secured' + password);
    }

    compare(secure: string, password: string): Promise<boolean> {
        return Promise.resolve(secure === 'secured' + password);
    }
}