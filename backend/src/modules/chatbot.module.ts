import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatBotModel } from '../models';
import { ChatBotEntity } from '../entities';

@Module({
  exports:[ChatBotModel],
  imports: [
    TypeOrmModule.forFeature([ChatBotEntity])
  ],
  providers: [ChatBotModel],
})

export class ChatBotModule {}
