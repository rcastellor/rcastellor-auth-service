export interface IPasswordSecure {
    secure(password: string): Promise<string>;
}