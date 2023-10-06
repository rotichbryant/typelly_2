import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModel } from '../models';
import { CompanyEntity } from '../entities';

@Module({
  exports:[CompanyModel],
  imports: [
    TypeOrmModule.forFeature([CompanyEntity])
  ],
  providers: [CompanyModel],
})
export class CompanyModule {}
