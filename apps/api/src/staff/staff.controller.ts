import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateStaffDto } from './dto/create-staff.dto.js';

@Controller()
export class StaffController {
    constructor(private staffService: StaffService) {}

    @UseGuards(JwtAuthGuard)
    @Post('staff')
    create(@Body() dto: CreateStaffDto, @Req() req: any) {
        return this.staffService.create(req.user.sub, dto.businessId, {
        name: dto.name,
        workingHours: typeof dto.workingHours === 'string' ? dto.workingHours : undefined,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('staff')
    findAll(@Query('businessId') businessId: string, @Req() req: any) {
        return this.staffService.findAllForBusiness(req.user.sub, businessId);
    }

    @Get('public/staff')
    findAllPublic(@Query('businessId') businessId: string) {
        return this.staffService.findAllForBusinessPublic(businessId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('staff/:id')
    update(@Param('id') id: string, @Body() dto: Partial<{ name: string; workingHours?: any }>, @Req() req: any) {
        return this.staffService.update(req.user.sub, id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('staff/:id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.staffService.remove(req.user.sub, id);
    }
}