import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEmail, IsNotEmpty, IsAlphanumeric } from 'class-validator';

export class SignupDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    readonly uuid: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    readonly username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}