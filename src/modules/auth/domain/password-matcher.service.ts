export interface IPasswordMatcher {
    match(password1: string, password2: string): Promise<boolean>;
}