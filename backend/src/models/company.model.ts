import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../entities';
import { CompanyRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import { first } from 'lodash';

@Injectable()
export default class CompanyModel {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: CompanyRepository,
  ) {}
  
  async first(): Promise<CompanyEntity>{
    return first(await this.companyRepository.find());
  }

  async save(data: any): Promise<any>{
    return await this.companyRepository.save(data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.companyRepository.delete(id);
  }
}
