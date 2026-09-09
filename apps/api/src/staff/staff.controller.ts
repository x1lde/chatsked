import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('staff')
export class StaffController {
    constructor(private staffService: StaffService) {}

    @Post()
    create(@Body() dto: { businessId: string; name: string; workingHours?: string }) {
        return this.staffService.create(dto.businessId, {
            name: dto.name,
            workingHours: dto.workingHours,
        });
    }

    @Get()
    findAll(@Query('businessId') businessId: string) {
        return this.staffService.findAllForBusiness(businessId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<{ name: string; workingHours?: string }>) {
        return this.staffService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.staffService.remove(id);
    }
}