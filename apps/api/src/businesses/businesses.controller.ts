import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BusinessesService } from './businesses.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessesController {
    constructor(private businessesService: BusinessesService) {}

    @Post()
    create(@Body() dto: { name: string; location?: string }, @Req() req: any) {
        return this.businessesService.create(req.user.sub, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.businessesService.findAllForOwner(req.user.sub);
    }
}