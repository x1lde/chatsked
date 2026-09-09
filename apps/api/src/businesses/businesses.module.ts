import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service.js';
import { BusinessesController } from './businesses.controller.js';

@Module({
  providers: [BusinessesService],
  controllers: [BusinessesController],
})
export class BusinessesModule {}