import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TaskStatus} from "../tasks/dto/task-status.enum";
import {UserEntity} from "./user.entity";

@Entity('tasks')
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  status: TaskStatus

  @ManyToOne(type => UserEntity, user => user.tasks, {eager: false})
  user: UserEntity

  @Column()
  userId: number
}