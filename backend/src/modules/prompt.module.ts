import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptModel } from '../models';
import { PromptEntity } from '../entities';

@Module({
  exports:[PromptModel],
  imports: [
    TypeOrmModule.forFeature([PromptEntity])
  ],
  providers: [PromptModel],
})
export class PromptModule {}
