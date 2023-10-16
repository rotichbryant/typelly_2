import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModel  } from '../models';
import { FileEntity } from '../entities';

@Module({
  exports:[FileModel],
  imports: [
    TypeOrmModule.forFeature([FileEntity])
  ],
  providers: [FileModel],
})

export class FileModule {}
