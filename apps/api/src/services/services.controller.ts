import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller()
export class ServicesController {
    constructor(private servicesService: ServicesService) {}

    @UseGuards(JwtAuthGuard)
    @Post('services')
    create(@Body() dto: { businessId: string; name: string; durationMin: number; price: number }) {
        return this.servicesService.create(dto.businessId, {
        name: dto.name,
        durationMin: dto.durationMin,
        price: dto.price,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('services')
    findAll(@Query('businessId') businessId: string) {
        return this.servicesService.findAllForBusiness(businessId);
    }

    @Get('public/services')
    findAllPublic(@Query('businessId') businessId: string) {
        return this.servicesService.findAllForBusiness(businessId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('services/:id')
    update(@Param('id') id: string, @Body() dto: Partial<{ name: string; durationMin: number; price: number }>) {
        return this.servicesService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('services/:id')
    remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}