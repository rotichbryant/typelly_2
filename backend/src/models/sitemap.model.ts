import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteMapEntity } from '../entities';
import { SiteMapRepository } from '../repositories';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class SiteMapModel {
  constructor(
    @InjectRepository(SiteMapEntity)
    private siteMapRepository: SiteMapRepository,
  ) {}

  async findOneBy(data: any): Promise<SiteMapEntity>{
    return await this.siteMapRepository.findOneBy(data);
  }

  async save(data: any): Promise<any>{
    return await this.siteMapRepository.save(data);
  }
  
  async update(appId:string,data: any): Promise<UpdateResult>{
    return await this.siteMapRepository.update(appId,data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.siteMapRepository.delete(id);
  }
}
