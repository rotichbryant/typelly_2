import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { PromptEntity } from './prompt.entity';
import { UserEntity } from './user.entity';
import { ChatBotEntity } from './chatbot.entity';


export enum ContentType {
  DOCUMENTS = 'documents',
  SITEMAP   = 'sitemap',
  WEBSITE   = 'website'
}

@Entity("apps")
export class AppEntity {
    
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  api_key: string;

  @Column({
    enum: ContentType,
    nullable: true,
    type: 'enum',
  })
  content_type: string;

  @Column()
  input_placeholder: string;

  @Column({
    nullable: true
  })
  hash_key: string;

  @Column()
  model: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
    default: 0
  })
  publish: boolean;
  
  @OneToMany(() => PromptEntity, (prompt) => prompt.app, { eager: true, cascade: true})
  prompts: PromptEntity[];

  @OneToMany(() => ChatBotEntity, (chatbot) => chatbot.app, { eager: true, cascade: true})
  chatbots: ChatBotEntity[];

  @ManyToOne(() => UserEntity, (user) => user.apps,{ eager: false,  onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({
    name:                 "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;

  @Column()
  user_id: string;

  @Column()
  welcome_message: string;
  
  @Column({
    nullable: true
  })
  website_url: string

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date
}