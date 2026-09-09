import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
    constructor(private servicesService: ServicesService) {}

    @Post()
    create(@Body() dto: { businessId: string; name: string; durationMin: number; price: number }) {
        return this.servicesService.create(dto.businessId, {
        name: dto.name,
        durationMin: dto.durationMin,
        price: dto.price,
        });
    }

    @Get()
    findAll(@Query('businessId') businessId: string) {
        return this.servicesService.findAllForBusiness(businessId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<{ name: string; durationMin: number; price: number }>) {
        return this.servicesService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}