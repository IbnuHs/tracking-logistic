import { Module } from '@nestjs/common';
import { QuickOrderService } from './quick-order.service';
import { QuickOrderController } from './quick-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuickOrder } from './entities/quick-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuickOrder])],
  controllers: [QuickOrderController],
  providers: [QuickOrderService],
})
export class QuickOrderModule {}
