import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller()
export class BookingsController {
    constructor(private bookingsService: BookingsService) {}

    @Get('public/availability')
    getAvailability(
        @Query('serviceId') serviceId: string,
        @Query('staffId') staffId: string,
        @Query('date') date: string,
    ) {
        return this.bookingsService.getAvailableSlots(serviceId, staffId, date);
    }

    @Post('public/bookings')
    createPublicBooking(@Body() dto: {
        businessId: string;
        serviceId: string;
        staffId: string;
        startsAt: string;
        customerName: string;
        customerPhone: string;
    }) {
        return this.bookingsService.createBooking(dto.businessId, { ...dto, source: 'MESSENGER' });
    }

    @UseGuards(JwtAuthGuard)
    @Get('bookings')
    findToday(@Query('businessId') businessId: string, @Req() req: any) {
        return this.bookingsService.findTodayForBusiness(req.user.sub, businessId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('bookings/all')
    findAll(@Query('businessId') businessId: string, @Req() req: any) {
        return this.bookingsService.findAllForBusiness(req.user.sub, businessId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('bookings/manual')
    createManualBooking(@Body() dto: {
        businessId: string;
        serviceId: string;
        staffId: string;
        startsAt: string;
        customerName: string;
        customerPhone: string;
    }, @Req() req: any) {
        return this.bookingsService.createBooking(dto.businessId, { ...dto, source: 'MANUAL' }, req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('bookings/:id/status')
    updateStatus(@Param('id') id: string, @Body() dto: { status: 'COMPLETED' | 'NO_SHOW' | 'CANCELLED' }, @Req() req: any) {
        return this.bookingsService.updateStatus(req.user.sub, id, dto.status);
    }
}