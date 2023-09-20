import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
})
export class CustomerModule {}
