import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity } from '../entities';
import { PromptRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import { first } from 'lodash';

@Injectable()
export default class PromptModel {
  constructor(
    @InjectRepository(PromptEntity)
    private promptRepository: PromptRepository,
  ) {}
  
  async first(): Promise<PromptEntity>{
    return first(await this.promptRepository.find());
  }

  async save(data: any): Promise<any>{
    return await this.promptRepository.save(data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.promptRepository.delete(id);
  }
}
