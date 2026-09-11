import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller()
export class StaffController {
    constructor(private staffService: StaffService) {}

    @UseGuards(JwtAuthGuard)
    @Post('staff')
    create(@Body() dto: { businessId: string; name: string; workingHours?: any }) {
        return this.staffService.create(dto.businessId, {
        name: dto.name,
        workingHours: dto.workingHours,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('staff')
    findAll(@Query('businessId') businessId: string) {
        return this.staffService.findAllForBusiness(businessId);
    }

    @Get('public/staff')
    findAllPublic(@Query('businessId') businessId: string) {
        return this.staffService.findAllForBusiness(businessId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('staff/:id')
    update(@Param('id') id: string, @Body() dto: Partial<{ name: string; workingHours?: any }>) {
        return this.staffService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('staff/:id')
    remove(@Param('id') id: string) {
        return this.staffService.remove(id);
    }
}