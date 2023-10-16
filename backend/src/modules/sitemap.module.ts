import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteMapModel } from '../models';
import { SiteMapEntity } from '../entities';

@Module({
  exports:[SiteMapModel],
  imports: [
    TypeOrmModule.forFeature([SiteMapEntity])
  ],
  providers: [SiteMapModel],
})

export class SiteMapModule {}
