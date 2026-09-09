import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
    @Post('bookings/manual')
    createManualBooking(@Body() dto: {
        businessId: string;
        serviceId: string;
        staffId: string;
        startsAt: string;
        customerName: string;
        customerPhone: string;
    }) {
        return this.bookingsService.createBooking(dto.businessId, { ...dto, source: 'MANUAL' });
    }

    @UseGuards(JwtAuthGuard)
    @Patch('bookings/:id/status')
    updateStatus(@Param('id') id: string, @Body() dto: { status: 'COMPLETED' | 'NO_SHOW' | 'CANCELLED' }) {
        return this.bookingsService.updateStatus(id, dto.status);
    }
}