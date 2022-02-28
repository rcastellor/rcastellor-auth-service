export interface IPasswordSecure {
    secure(password: string): Promise<string>;
    compare(secured: string, password: string): Promise<boolean>;
}