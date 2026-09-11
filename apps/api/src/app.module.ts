import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { BusinessAccessModule } from './common/business-access.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BusinessesModule } from './businesses/businesses.module.js';
import { StaffModule } from './staff/staff.module.js';
import { ServicesModule } from './services/services.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { RemindersModule } from './reminders/reminders.module.js';
import { MessengerModule } from './webhooks/messenger.module.js';

@Module({
  imports: [
    PrismaModule,
    BusinessAccessModule,
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
