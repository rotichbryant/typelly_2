import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entities';
import { RoleRepository } from '../repositories';

@Injectable()
export default class RoleModel {
  constructor(
    @InjectRepository(RoleEntity)
    private usersRepository: RoleRepository,
  ) {}

  async findOneBy(data: object): Promise<RoleEntity> {
    return await this.usersRepository.findOneBy(data);
  }
  
  async save(data: any): Promise<any>{
    return await this.usersRepository.save(data);
  }

}
