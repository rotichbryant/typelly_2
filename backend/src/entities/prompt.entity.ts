import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AppEntity } from './index';

@Entity("prompts")
export class PromptEntity {
    
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;
  
  @ManyToOne(() => AppEntity, (app) => app.prompts, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
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