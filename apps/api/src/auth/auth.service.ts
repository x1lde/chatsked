import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async signup(email: string, password: string) {
        const existing = await this.prisma.owner.findUnique({ where: { email } });
        if (existing) throw new ConflictException('Email already registered');

        const passwordHash = await bcrypt.hash(password, 10);
        const owner = await this.prisma.owner.create({ data: { email, passwordHash } });
        return this.issueToken(owner.id, owner.email);
    }

    async login(email: string, password: string) {
        const owner = await this.prisma.owner.findUnique({ where: { email } });
        if (!owner) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(password, owner.passwordHash);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        return this.issueToken(owner.id, owner.email);
    }

    private issueToken(sub: string, email: string) {
        return { accessToken: this.jwt.sign({ sub, email }) };
    }
}