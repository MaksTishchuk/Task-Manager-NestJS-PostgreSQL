import {Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskDto} from "./dto/update-task.dto";
import {GetTaskFilterDto} from "./dto/get-task-filter.dto";
import {TaskStatus} from "./dto/task-status.enum";
import {TaskEntity} from "../entities/task.entity";
import {ILike, Repository} from "typeorm";
import {UserEntity} from "../entities/user.entity";


@Injectable()
export class TasksService {

  private logger = new Logger('TasksService')

  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: UserEntity): Promise<TaskEntity[]> {
    try {
      const {status, search} = filterDto
      if (status && search) {
        return await this.taskRepository.findBy([
          // If you don't add the userId column to the TaskEntity
          // {status, user: {id: user.id}, title: ILike(`%${search}%`)}, {status, user: {id: user.id}, description: ILike(`%${search}%`)}
          {status, userId: user.id, title: ILike(`%${search}%`)},
          {status, userId: user.id, description: ILike(`%${search}%`) }
        ])
      }
      if (status) {
        return this.taskRepository.find({where: {status, userId: user.id}})
      }
      if (search) {
        return await this.taskRepository.findBy([
          {userId: user.id, title: ILike(`%${search}%`)},
          {userId: user.id, description: ILike(`%${search}%`)}
        ])
      }
      return this.taskRepository.find({where: {userId: user.id}})
    } catch (error) {
      this.logger.error(`Failed to get tasks for user ${user.username}, filter: ${JSON.stringify(filterDto)}!`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({where: {id, userId: user.id}})
    if (!task) {
      throw new NotFoundException(`Task with id ${id} was not found!`)
    }
    return task
  }

  async creatTask(createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
    const task = await this.taskRepository.create({...createTaskDto, status: TaskStatus.OPEN, user: user})
    await task.save()
    delete task.user // If i don`t need user in response
    return task
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto, user: UserEntity): Promise<TaskEntity> {
    const updatedTask = await this.taskRepository.update({id, userId: user.id}, updateTaskDto)
    if (!updatedTask.affected) {
      throw new NotFoundException(`Task with id ${id} was not updated!`)
    }
    return await this.getTaskById(id, user)
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: UserEntity): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user)
    task.status = status
    await task.save()
    return task
  }

  async deleteTask(id: number, user: UserEntity): Promise<void> {
    const result = await this.taskRepository.delete({id, userId: user.id})
    if (!result.affected) {
      throw new NotFoundException(`Task with id ${id} was not deleted!`)
    }
  }
}
