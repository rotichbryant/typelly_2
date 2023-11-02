import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppEntity } from '../entities';
import { AppRepository } from '../repositories';
import { DeleteResult, UpdateResult } from 'typeorm';
import { first } from 'lodash';
import { FilterOperator, FilterSuffix, Paginate, PaginateQuery, paginate, Paginated } from '@ai-em/nestjs-paginate'

@Injectable()
export class AppModel {
  constructor(
    @InjectRepository(AppEntity)
    private appRepository: AppRepository,
  ) {}
  
  async get(query: PaginateQuery): Promise<Paginated<AppEntity>> {
    return paginate(query, this.appRepository, {
      sortableColumns:   ['name'],
      searchableColumns: ['user_id'],
    });
  }

  async findOneBy(data: any): Promise<AppEntity>{
    return await this.appRepository.findOneBy(data);
  }

  async first(): Promise<AppEntity>{
    return first(await this.appRepository.find());
  }

  async save(data: any): Promise<any>{
    return await this.appRepository.save(data);
  }
  
  async update(appId:string,data: any): Promise<UpdateResult>{
    return await this.appRepository.update(appId,data);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.appRepository.delete(id);
  }
}
