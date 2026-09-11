import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Get()
    findAll(@Query('businessId') businessId: string) {
        return this.customersService.findAllForBusiness(businessId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.customersService.findOneWithHistory(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<{ name: string; phone: string }>) {
        return this.customersService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.customersService.remove(id);
    }
}
