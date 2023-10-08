import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities';
import { MessageRepository } from '../repositories';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class MessageModel {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: MessageRepository,
  ) {}
  
  async findOneBy(data: any): Promise<MessageEntity>{
    return await this.messageRepository.findOneBy(data);
  }

  async save(data: any): Promise<any>{
    return await this.messageRepository.save(data);
  }
  
  async update(messageId:string,data: any): Promise<UpdateResult>{
    return await this.messageRepository.update(messageId,data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.messageRepository.delete(id);
  }
}
