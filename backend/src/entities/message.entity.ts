import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { ChatBotEntity } from './chatbot.entity';

export enum MessageType {
    ANSWER = 'answer',
    QUESTION = 'question'
}

@Entity("messages")
export class MessageEntity {
    
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => ChatBotEntity, (chatbot) => chatbot.messages,{ eager: true, lazy: false,  onDelete: 'CASCADE', onUpdate: 'CASCADE' } )
  @JoinColumn({
    name:                 "chatbot_id",
    referencedColumnName: "id",
  })
  chatbot: ChatBotEntity;

  @Column()
  chatbot_id: string;

  @Column("longtext")
  content: string;

  @Column({
    enum: MessageType,
    default: MessageType.QUESTION,
    type: 'enum',
  })
  type: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date
}