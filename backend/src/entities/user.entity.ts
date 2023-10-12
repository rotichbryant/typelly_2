import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AppEntity, CompanyEntity, RoleEntity } from './index';

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => AppEntity, (app) => app.user, { eager: false, lazy: true })
  apps: AppEntity[];

  @ManyToOne(() => CompanyEntity, (company) => company.users)
  @JoinColumn({
    name:                 "company_id",
    referencedColumnName: "id",
  })
  company?: CompanyEntity;

  @Column()
  company_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    unique: true
  })
  email: string

  @Column({
    nullable: true
  })
  email_verified_at: string

  @Column()
  image: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;
  
  @ManyToOne(() => RoleEntity, (role) => role.users,{ eager: true })
  @JoinColumn({
    name:                 "role_id",
    referencedColumnName: "id",
  })
  role: RoleEntity;

  @Column()
  role_id: string;

  @Column()
  token: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
  @DeleteDateColumn()
  deleted_at: Date; // Deletion date   
}