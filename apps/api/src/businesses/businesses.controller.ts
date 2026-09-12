import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BusinessesService } from './businesses.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateBusinessDto } from './dto/create-business.dto.js';

@Controller()
export class BusinessesController {
    constructor(private businessesService: BusinessesService) {}

    @UseGuards(JwtAuthGuard)
    @Post('businesses')
    create(@Body() dto: CreateBusinessDto, @Req() req: any) {
        return this.businessesService.create(req.user.sub, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('businesses')
    findAll(@Req() req: any) {
        return this.businessesService.findAllForOwner(req.user.sub);
    }

    @Get('public/businesses/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.businessesService.findBySlug(slug);
    }
}