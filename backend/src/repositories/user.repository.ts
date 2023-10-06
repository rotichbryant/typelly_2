import { Repository } from 'typeorm';
import { UserEntity } from '../entities'

export class UserRepository extends Repository<UserEntity>{}