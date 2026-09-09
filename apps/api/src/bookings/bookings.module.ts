import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { BookingsController } from './bookings.controller.js';
import { RemindersModule } from '../reminders/reminders.module.js';

@Module({
  imports: [RemindersModule],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}