import { Repository } from 'typeorm';
import { MessageEntity } from '../entities'

export class MessageRepository extends Repository<MessageEntity>{}
