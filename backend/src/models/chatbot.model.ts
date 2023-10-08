import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatBotEntity } from '../entities';
import { ChatbotRepository } from '../repositories';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class ChatBotModel {
  constructor(
    @InjectRepository(ChatBotEntity)
    private chatbotRepository: ChatbotRepository,
  ) {}
  
  async save(data: any): Promise<any>{
    return await this.chatbotRepository.save(data);
  }
  
  async update(chatbotId:string,data: any): Promise<UpdateResult>{
    return await this.chatbotRepository.update(chatbotId,data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.chatbotRepository.delete(id);
  }
}
