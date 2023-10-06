import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../models';
import { UserEntity } from '../entities';

@Module({
  exports:[UserModel],
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [UserModel],
})
export class UserModule {}
