import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { AppEntity } from './app.entity';
import { MessageEntity } from './message.entity';

@Entity("chatbot")
export class ChatBotEntity {
    
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => MessageEntity, (message) => message.chatbot, { eager: false, lazy: true, cascade: true})
  messages: MessageEntity[];

  @ManyToOne(() => AppEntity, (app) => app.chatbots,{ eager: true, lazy: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({
    name:                 "app_id",
    referencedColumnName: "id",
  })
  app: AppEntity;

  @Column()
  app_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date
}