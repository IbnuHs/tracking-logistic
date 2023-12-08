import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendAccessCodeModule } from './send-access-code/send-access-code.module';
import { TrackingLogisticModule } from './tracking-logistic/tracking-logistic.module';
import { InsertDataModule } from './insert-data/insert-data.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'tracking-logistic',
      password: '',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SendAccessCodeModule,
    TrackingLogisticModule,
    InsertDataModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
