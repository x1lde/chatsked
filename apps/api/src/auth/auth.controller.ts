import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

class AuthDto {
    email: string;
    password: string;
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