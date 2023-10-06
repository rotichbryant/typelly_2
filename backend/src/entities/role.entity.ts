import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyEntity, UserEntity } from './index';

@Entity("roles")
export class RoleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CompanyEntity, (company) => company.roles)
  @JoinColumn({
    name:                 "company_id",
    referencedColumnName: "id",
  })
  company: CompanyEntity;

  @Column()
  company_id: string;

  @Column()
  name: string;

  @Column({
    nullable: false,
    default: 0
  })
  state: number;

  @OneToMany(() => UserEntity, (user) => user.role )
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "role_id",
  })
  users: UserEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}