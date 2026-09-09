import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BusinessesModule } from './businesses/businesses.module.js';
import { StaffModule } from './staff/staff.module.js';
import { ServicesModule } from './services/services.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { RemindersModule } from './reminders/reminders.module.js';
import { MessengerModule } from './webhooks/messenger.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'api',
    }),
    PrismaModule,
    AuthModule,
    BusinessesModule,
    StaffModule,
    ServicesModule,
    CustomersModule,
    BookingsModule,
    RemindersModule,
    MessengerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
