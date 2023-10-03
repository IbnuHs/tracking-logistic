import { Module } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { CustomerServiceController } from './customer-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './entities/customer-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerService])],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService],
})
export class CustomerServiceModule {}
