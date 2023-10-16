import { Repository } from 'typeorm';
import { FileEntity } from '../entities'

export class FileRepository extends Repository<FileEntity>{}