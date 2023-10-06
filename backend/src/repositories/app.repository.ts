import { Repository } from 'typeorm';
import { AppEntity } from '../entities'

export class AppRepository extends Repository<AppEntity>{}