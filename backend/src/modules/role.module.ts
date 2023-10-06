import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModel } from '../models';
import { RoleEntity } from '../entities';

@Module({
  exports:[RoleModel],
  imports: [
    TypeOrmModule.forFeature([RoleEntity])
  ],
  providers: [RoleModel],
})
export class RoleModule {}
