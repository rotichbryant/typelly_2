import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModel } from '../models';
import { MessageEntity } from '../entities';

@Module({
  exports:[MessageModel],
  imports: [
    TypeOrmModule.forFeature([MessageEntity])
  ],
  providers: [MessageModel],
})

export class MessageModule {}
