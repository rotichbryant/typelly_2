import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModel } from '../models';
import { AppEntity } from '../entities';

@Module({
  exports:[AppModel],
  imports: [
    TypeOrmModule.forFeature([AppEntity])
  ],
  providers: [AppModel],
})
export class AiAppModule {}
