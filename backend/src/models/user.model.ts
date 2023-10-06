import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';

@Injectable()
export default class UserModel {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: UserRepository,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneBy(data: object): Promise<UserEntity> {
    return await this.usersRepository.findOneOrFail({ where: data });
  }
  
  async save(data: any): Promise<any>{
    return await this.usersRepository.save(data);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
