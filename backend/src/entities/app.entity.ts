import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { PromptEntity } from './prompt.entity';
import { UserEntity } from './user.entity';
import { ChatBotEntity } from './chatbot.entity';

@Entity("apps")
export class AppEntity {
    
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  welcome_message: string;

  @Column()
  input_placeholder: string;

  @Column({
    nullable: true
  })
  hash_key: string;

  @Column({
    nullable: true,
    default: 0
  })
  publish: boolean;
  
  @OneToMany(() => PromptEntity, (prompt) => prompt.app, { eager: true, cascade: true})
  prompts: PromptEntity[];

  @OneToMany(() => ChatBotEntity, (chatbot) => chatbot.app, { eager: true, cascade: true})
  chatbots: ChatBotEntity[];

  @ManyToOne(() => UserEntity, (user) => user.apps,{ eager: false })
  @JoinColumn({
    name:                 "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date
}