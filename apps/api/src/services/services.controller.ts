import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller()
export class ServicesController {
    constructor(private servicesService: ServicesService) {}

    @UseGuards(JwtAuthGuard)
    @Post('services')
    create(@Body() dto: { businessId: string; name: string; durationMin: number; price: number }, @Req() req: any) {
        return this.servicesService.create(req.user.sub, dto.businessId, {
        name: dto.name,
        durationMin: dto.durationMin,
        price: dto.price,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('services')
    findAll(@Query('businessId') businessId: string, @Req() req: any) {
        return this.servicesService.findAllForBusiness(req.user.sub, businessId);
    }

    @Get('public/services')
    findAllPublic(@Query('businessId') businessId: string) {
        return this.servicesService.findAllForBusinessPublic(businessId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('services/:id')
    update(@Param('id') id: string, @Body() dto: Partial<{ name: string; durationMin: number; price: number }>, @Req() req: any) {
        return this.servicesService.update(req.user.sub, id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('services/:id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.servicesService.remove(req.user.sub, id);
    }
}