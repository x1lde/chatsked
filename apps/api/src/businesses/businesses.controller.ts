import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BusinessesService } from './businesses.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateBusinessDto } from './dto/create-business.dto.js';
import { UpdateBusinessDto } from './dto/update-business.dto.js';

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

    @UseGuards(JwtAuthGuard)
    @Patch('businesses/:id')
    update(@Param('id') id: string, @Body() dto: UpdateBusinessDto, @Req() req: any) {
        return this.businessesService.update(req.user.sub, id, dto);
    }

    @Get('public/businesses/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.businessesService.findBySlug(slug);
    }
}