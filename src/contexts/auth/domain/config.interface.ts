export interface IAuthConfig {
    tokenDuration(): number;
    refreshDuration(): number;
    secretKey(): string;
}