import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';

import { AuthService } from './auth.service.js';

class AuthDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto.email, dto.password);
    }

    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto.email, dto.password);
    }
}