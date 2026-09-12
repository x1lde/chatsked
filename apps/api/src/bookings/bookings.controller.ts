import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { BookingsService } from './bookings.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { HmacGuard } from '../common/hmac.guard.js';
import { CreatePublicBookingDto } from './dto/create-booking.dto.js';

@Controller()
export class BookingsController {
    constructor(private bookingsService: BookingsService) {}

    @Throttle({ default: { limit: 20, ttl: 60_000 } })
    @Get('public/availability')
    getAvailability(
        @Query('businessId') businessId: string,
        @Query('serviceId') serviceId: string,
        @Query('staffId') staffId: string,
        @Query('date') date: string,
    ) {
        return this.bookingsService.getAvailableSlots(businessId, serviceId, staffId, date);
    }

    @UseGuards(HmacGuard)
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @Post('public/bookings')
    createPublicBooking(@Body() dto: CreatePublicBookingDto) {
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
    createManualBooking(@Body() dto: CreatePublicBookingDto, @Req() req: any) {
        return this.bookingsService.createBooking(dto.businessId, { ...dto, source: 'MANUAL' }, req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('bookings/:id/status')
    updateStatus(@Param('id') id: string, @Body() dto: { status: 'COMPLETED' | 'NO_SHOW' | 'CANCELLED' }, @Req() req: any) {
        return this.bookingsService.updateStatus(req.user.sub, id, dto.status);
    }
}