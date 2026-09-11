import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Get()
    findAll(@Query('businessId') businessId: string, @Req() req: any) {
        return this.customersService.findAllForBusiness(req.user.sub, businessId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.customersService.findOneWithHistory(req.user.sub, id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<{ name: string; phone: string }>, @Req() req: any) {
        return this.customersService.update(req.user.sub, id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.customersService.remove(req.user.sub, id);
    }
}
