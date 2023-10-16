import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entities';
import { FileRepository } from '../repositories';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class FileModel {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: FileRepository,
  ) {}
  
  async findOneBy(data: any): Promise<FileEntity>{
    return await this.fileRepository.findOneBy(data);
  }

  async save(data: any): Promise<any>{
    return await this.fileRepository.save(data);
  }
  
  async update(appId:string,data: any): Promise<UpdateResult>{
    return await this.fileRepository.update(appId,data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.fileRepository.delete(id);
  }
}
