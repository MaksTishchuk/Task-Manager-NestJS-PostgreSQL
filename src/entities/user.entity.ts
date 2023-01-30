import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {TaskEntity} from "./task.entity";

@Entity('users')
@Unique(['username'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @OneToMany(type => TaskEntity, task => task.user, {eager: true})
  tasks: TaskEntity[]
}